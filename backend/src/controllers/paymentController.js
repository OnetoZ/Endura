const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
const VaultItem = require('../models/VaultItem');
const razorpayInstance = require('../utils/razorpay');
const asyncHandler = require('../utils/asyncHandler');

// Helper: generate vault items after payment
const generateVaultItems = async (order) => {
    const vaultPromises = order.items
        .filter(item => item.product) // only items with digital twin
        .map(item =>
            VaultItem.create({
                user: order.user,
                order: order._id,
                product: item.product,
                productName: item.name,
                productImage: item.image,
            })
        );
    await Promise.all(vaultPromises);
};

/**
 * @route   POST /api/payment/create-order
 * @access  Private
 */
const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items provided');
    }

    if (!razorpayInstance) {
        res.status(500);
        throw new Error('Razorpay is not configured');
    }

    let calculatedTotal = 0;
    const itemsForDB = [];

    // Validate cart data & calculate total
    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
            res.status(404);
            throw new Error(`Product not found: ${item.product}`);
        }
        if (product.stock < item.quantity) {
            res.status(400);
            throw new Error(`Insufficient stock for: ${product.name}`);
        }
        calculatedTotal += product.price * item.quantity;
        
        itemsForDB.push({
            product: product._id,
            name: product.name,
            image: product.images && product.images.length > 0 ? product.images[0] : '',
            quantity: item.quantity,
            price: product.price,
            editionNumber: product.sold, // We will increment stock and sold later on verify
        });
    }

    // Razorpay amount is in paise
    const amountInPaise = Math.round(calculatedTotal * 100);

    const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${Date.now()}_${req.user._id}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    if (!razorpayOrder) {
        res.status(500);
        throw new Error('Failed to create Razorpay order');
    }

    // Save order in DB with 'pending'
    const order = await Order.create({
        user: req.user._id,
        items: itemsForDB,
        shippingAddress,
        paymentMethod: 'ONLINE',
        totalAmount: calculatedTotal,
        currency: 'INR',
        razorpayOrderId: razorpayOrder.id,
        paymentStatus: 'pending',
        status: 'Pending',
    });

    res.status(201).json({
        success: true,
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount, // in paise
        currency: razorpayOrder.currency,
        db_order_id: order._id,
    });
});

/**
 * @route   POST /api/payment/verify
 * @access  Private
 */
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, db_order_id } = req.body;

    const order = await Order.findById(db_order_id);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Generate Signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        // Valid payment
        order.paymentStatus = 'paid';
        order.isPaid = true;
        order.paidAt = Date.now();
        order.status = 'Confirmed';
        order.razorpayPaymentId = razorpay_payment_id;

        await order.save();

        // Create Payment record
        await Payment.create({
            orderId: order._id,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            amount: order.totalAmount,
            method: 'Razorpay',
            status: 'captured',
        });

        // Decrement stock and increment sold count
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity, sold: item.quantity } }
            );
        }

        // Clear the user's cart
        await Cart.findOneAndUpdate({ user: order.user }, { items: [] });
        
        // Auto-generate vault items
        await generateVaultItems(order);

        res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
        // Invalid payment signature
        order.paymentStatus = 'failed';
        await order.save();

        res.status(400);
        throw new Error('Invalid payment signature');
    }
});

/**
 * @route   POST /api/payment/webhook
 * @access  Public
 */
const webhook = asyncHandler(async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (secret) {
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (req.headers['x-razorpay-signature'] !== expectedSignature) {
            res.status(400).json({ error: 'Invalid signature' });
            return;
        }
    }

    const { event, payload } = req.body;

    if (event === 'payment.captured') {
        const payment = payload.payment.entity;
        const razorpayOrderId = payment.order_id;
        const razorpayPaymentId = payment.id;

        const order = await Order.findOne({ razorpayOrderId });
        if (order && order.paymentStatus === 'pending') {
            order.paymentStatus = 'paid';
            order.isPaid = true;
            order.paidAt = Date.now();
            order.status = 'Confirmed';
            order.razorpayPaymentId = razorpayPaymentId;
            await order.save();
            
            await Payment.create({
                orderId: order._id,
                razorpayOrderId,
                razorpayPaymentId,
                amount: order.totalAmount,
                method: payment.method,
                status: 'captured',
            });

            for (const item of order.items) {
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { stock: -item.quantity, sold: item.quantity } }
                );
            }

            await Cart.findOneAndUpdate({ user: order.user }, { items: [] });
            await generateVaultItems(order);
        }
    } else if (event === 'payment.failed') {
        const payment = payload.payment.entity;
        const razorpayOrderId = payment.order_id;

        const order = await Order.findOne({ razorpayOrderId });
        if (order && order.paymentStatus === 'pending') {
            order.paymentStatus = 'failed';
            await order.save();
        }
    }

    res.status(200).json({ status: 'ok' });
});

module.exports = {
    createOrder,
    verifyPayment,
    webhook,
};
