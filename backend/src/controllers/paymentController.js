const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
const VaultItem = require('../models/VaultItem');
const { razorpayInstance, razorpayKeyId } = require('../utils/razorpay');
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
    const bodyKeys = Object.keys(req.body || {});

    console.log('[payment/create-order] Incoming request', {
        userId: req.user?._id?.toString?.() || null,
        bodyKeys,
        orderItemsCount: Array.isArray(orderItems) ? orderItems.length : null,
        hasShippingAddress: Boolean(shippingAddress),
        shippingAddressFields: shippingAddress ? Object.keys(shippingAddress) : [],
    });

    if (!req.user || !req.user._id) {
        console.error('[payment/create-order] Rejected: missing authenticated user in request');
        res.status(401);
        throw new Error('Authentication required to create order');
    }

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
        console.error('[payment/create-order] Rejected: no order items provided', {
            userId: req.user?._id?.toString?.() || null,
            bodyKeys,
        });
        res.status(400);
        throw new Error('No order items provided');
    }

    const invalidItemIndex = orderItems.findIndex(
        (item) => !item || !item.product || !Number.isFinite(Number(item.quantity)) || Number(item.quantity) <= 0
    );
    if (invalidItemIndex !== -1) {
        console.error('[payment/create-order] Rejected: invalid order item payload', {
            userId: req.user?._id?.toString?.() || null,
            invalidItemIndex,
            invalidItem: orderItems[invalidItemIndex],
        });
        res.status(400);
        throw new Error(`Invalid order item at index ${invalidItemIndex}. Each item must include product and quantity > 0`);
    }

    const requiredAddressFields = ['fullName', 'address', 'city', 'postalCode', 'country'];
    const missingAddressFields = requiredAddressFields.filter((field) => {
        const value = shippingAddress?.[field];
        return typeof value !== 'string' || value.trim().length === 0;
    });

    if (missingAddressFields.length > 0) {
        console.error('[payment/create-order] Rejected: missing required shipping address fields', {
            userId: req.user?._id?.toString?.() || null,
            missingAddressFields,
            receivedShippingAddress: shippingAddress || null,
        });
        res.status(400);
        throw new Error(`Missing required shipping address fields: ${missingAddressFields.join(', ')}`);
    }

    if (!razorpayInstance) {
        console.error('[payment/create-order] Razorpay is not configured');
        res.status(500);
        throw new Error('Razorpay is not configured');
    }

    let calculatedTotal = 0;
    const itemsForDB = [];

    // Validate cart data & calculate total
    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
            console.error('[payment/create-order] Rejected: product not found', {
                productId: item.product,
            });
            res.status(404);
            throw new Error(`Product not found: ${item.product}`);
        }
        if (product.stock < item.quantity) {
            console.error('[payment/create-order] Rejected: insufficient stock', {
                productId: item.product,
                productName: product.name,
                requestedQuantity: item.quantity,
                availableStock: product.stock,
            });
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

    // Limit receipt to 40 characters (rcpt_ + Date.now() + 6 chars of user ID is ~25 chars)
    const receiptId = `rcpt_${Date.now()}_${req.user._id.toString().slice(-6)}`;

    const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId.slice(0, 40),
    };

    let razorpayOrder;
    try {
        razorpayOrder = await razorpayInstance.orders.create(options);
    } catch (razorpayError) {
        console.error('[payment/create-order] Razorpay creation failed', {
            error: razorpayError,
            options
        });
        res.status(razorpayError.statusCode || 400);
        throw new Error(razorpayError.error?.description || razorpayError.message || 'Failed to create Razorpay order');
    }

    if (!razorpayOrder) {
        console.error('[payment/create-order] Razorpay order creation failed with empty response');
        res.status(500);
        throw new Error('Failed to create Razorpay order');
    }

    // Save order in DB with 'pending'
    const order = await Order.create({
        user: req.user._id,
        items: itemsForDB,
        shippingAddress,
        paymentMethod: 'ONLINE',
        itemsPrice: calculatedTotal,
        shippingPrice: 0,
        taxPrice: 0, // already included in calculatedTotal in this logic, but if taxes are separate, we should specify.
        totalAmount: calculatedTotal,
        currency: 'INR',
        razorpayOrderId: razorpayOrder.id,
        paymentStatus: 'pending',
        status: 'Pending',
    });

    res.status(201).json({
        success: true,
        orderId: razorpayOrder.id,
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount, // in paise
        currency: razorpayOrder.currency,
        keyId: razorpayKeyId,
        dbOrderId: order._id,
        db_order_id: order._id,
    });

    console.log('[payment/create-order] Order created successfully', {
        userId: req.user?._id?.toString?.() || null,
        dbOrderId: order._id.toString(),
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
    });
});

/**
 * @route   POST /api/payment/verify
 * @access  Private
 */
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, db_order_id } = req.body;
    const userId = req.user?._id?.toString?.() || null;

    console.log('[payment/verify] Incoming verification request', {
        userId,
        hasOrderId: Boolean(razorpay_order_id),
        hasPaymentId: Boolean(razorpay_payment_id),
        hasSignature: Boolean(razorpay_signature),
        dbOrderId: db_order_id || null,
    });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        res.status(400);
        throw new Error('Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature');
    }

    const order = await Order.findById(db_order_id);
    if (!order) {
        console.error('[payment/verify] Rejected: DB order not found', {
            userId,
            dbOrderId: db_order_id || null,
        });
        res.status(404);
        throw new Error('Order not found');
    }

    // Generate Signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    console.log('[payment/verify] Generated signature for comparison', {
        userId,
        dbOrderId: db_order_id || null,
    });

    if (expectedSignature === razorpay_signature) {
        // Idempotency check: only reduce stock if not already marks as paid
        if (order.paymentStatus === 'paid') {
            console.log('[payment/verify] Order already marked as paid, skipping stock update');
            return res.status(200).json({
                success: true,
                message: 'Payment already verified',
                dbOrderId: order._id,
            });
        }

        // Valid payment
        order.paymentStatus = 'paid';
        order.isPaid = true;
        order.paidAt = Date.now();
        order.status = 'Confirmed';
        order.razorpayPaymentId = razorpay_payment_id;

        await order.save();

        console.log('[payment/verify] Order status updated to PAID, starting stock reduction');

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
        const stockPromises = order.items.map(async (item) => {
            const qty = Number(item.quantity);
            if (!qty || qty <= 0) return;
            
            console.log(`[payment/verify] Reducing stock for product ${item.product} by ${qty}`);
            
            const updatedProduct = await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -qty, sold: qty } },
                { new: true, runValidators: true }
            );

            if (!updatedProduct) {
                console.error(`[payment/verify] FAILED to find/update product ${item.product}`);
            } else {
                console.log(`[payment/verify] Product ${item.product} stock updated. New stock: ${updatedProduct.stock}`);
            }
        });
        
        await Promise.all(stockPromises);

        // Clear the user's cart
        await Cart.findOneAndUpdate({ user: order.user }, { items: [] });
        
        // Auto-generate vault items
        await generateVaultItems(order);

        console.log('[payment/verify] Payment verified successfully', {
            userId,
            dbOrderId: db_order_id || null,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
        });

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            dbOrderId: order._id,
        });
    } else {
        // Invalid payment signature
        order.paymentStatus = 'failed';
        await order.save();

        console.error('[payment/verify] Signature mismatch', {
            userId,
            dbOrderId: db_order_id || null,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
        });

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
            
            console.log('[payment/webhook] Event payment.captured: status updated to PAID, starting stock reduction');

            await Payment.create({
                orderId: order._id,
                razorpayOrderId,
                razorpayPaymentId,
                amount: order.totalAmount,
                method: payment.method,
                status: 'captured',
            });

            // Decrement stock and increment sold count
            const stockPromises = order.items.map(async (item) => {
                const qty = Number(item.quantity);
                if (!qty || qty <= 0) return;
                
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { stock: -qty, sold: qty } },
                    { new: true, runValidators: true }
                );
            });
            await Promise.all(stockPromises);

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
