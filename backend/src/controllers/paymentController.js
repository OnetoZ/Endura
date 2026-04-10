const crypto = require('crypto');
const Order = require('../models/Order');
const Asset = require('../models/Asset');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
const VaultItem = require('../models/VaultItem');
const { razorpayInstance, razorpayKeyId } = require('../utils/razorpay');
const asyncHandler = require('../utils/asyncHandler');

// Helper: generate vault items after payment
const generateVaultItems = async (order) => {
    const vaultPromises = order.items
        .filter(item => item.asset) // only items with digital twin
        .map(item =>
            VaultItem.create({
                user: order.user,
                order: order._id,
                asset: item.asset,
                assetName: item.name,
                assetImage: item.image,
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
            userId: req.user._id.toString(),
            bodyKeys,
        });
        res.status(400);
        throw new Error('Your cart is empty or no order items were provided.');
    }

    const invalidItemIndex = orderItems.findIndex(
        (item) => !item || !item.asset || !Number.isFinite(Number(item.quantity)) || Number(item.quantity) <= 0
    );
    if (invalidItemIndex !== -1) {
        const invalidItem = orderItems[invalidItemIndex];
        console.error('[payment/create-order] Rejected: invalid order item payload', {
            userId: req.user._id.toString(),
            invalidItemIndex,
            invalidItem,
        });
        res.status(400);
        throw new Error(`Invalid item at index ${invalidItemIndex}. Make sure all items have a valid ID and quantity > 0.`);
    }

    const requiredAddressFields = ['fullName', 'address', 'city', 'postalCode', 'country'];
    const missingAddressFields = requiredAddressFields.filter((field) => {
        const value = shippingAddress?.[field];
        return typeof value !== 'string' || value.trim().length === 0;
    });

    if (missingAddressFields.length > 0) {
        console.error('[payment/create-order] Rejected: missing required shipping address fields', {
            userId: req.user._id.toString(),
            missingAddressFields,
            receivedShippingAddress: shippingAddress || 'MISSING',
        });
        res.status(400);
        throw new Error(`Please provide all shipping details: ${missingAddressFields.join(', ')}`);
    }

    if (!razorpayInstance) {
        console.error('[payment/create-order] Razorpay is not configured');
        res.status(500);
        throw new Error('Server Configuration Error: Razorpay is not initialized. Please check backend environment variables.');
    }

    let calculatedTotal = 0;
    const itemsForDB = [];

    // Validate cart data & calculate total
    for (const item of orderItems) {
        const asset = await Asset.findById(item.asset);
        if (!asset) {
            console.error('[payment/create-order] Rejected: asset not found', {
                assetId: item.asset,
                userId: req.user._id.toString()
            });
            res.status(404);
            throw new Error(`Product not found: ${item.asset}. It might have been removed.`);
        }
        if (asset.stock < item.quantity) {
            console.error('[payment/create-order] Rejected: insufficient stock', {
                assetId: item.asset,
                assetName: asset.name,
                requestedQuantity: item.quantity,
                availableStock: asset.stock,
            });
            res.status(400);
            throw new Error(`Insufficient stock for "${asset.name}". Available: ${asset.stock}`);
        }
        calculatedTotal += asset.price * item.quantity;
        
        itemsForDB.push({
            asset: asset._id,
            name: asset.name,
            image: asset.images && asset.images.length > 0 ? asset.images[0] : '',
            quantity: item.quantity,
            price: asset.price,
            size: item.selectedSize || item.size || '',
            editionNumber: asset.sold, 
        });
    }

    if (calculatedTotal <= 0) {
        console.error('[payment/create-order] Rejected: total amount is 0 or less', { calculatedTotal });
        res.status(400);
        throw new Error('Total order amount must be greater than zero.');
    }

    // Razorpay amount is in paise
    const amountInPaise = Math.round(calculatedTotal * 100);

    if (amountInPaise < 100) {
        console.error('[payment/create-order] Rejected: amount too small for Razorpay', { amountInPaise });
        res.status(400);
        throw new Error('The minimum transaction amount is ₹1.00 (100 paise).');
    }

    // Limit receipt to 40 characters
    const receiptId = `rcpt_${Date.now()}_${req.user._id.toString().slice(-6)}`;

    const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId.slice(0, 40),
    };

    console.log('[payment/create-order] Requesting Razorpay order', options);

    let razorpayOrder;
    try {
        razorpayOrder = await razorpayInstance.orders.create(options);
    } catch (razorpayError) {
        console.error('[payment/create-order] Razorpay creation failed', {
            error: razorpayError,
            options,
            userId: req.user._id.toString()
        });
        
        // Detailed Razorpay error reporting
        const statusCode = razorpayError.statusCode || 400;
        const descripton = razorpayError.error?.description || razorpayError.message || 'Razorpay Gateway Error';
        
        res.status(statusCode);
        throw new Error(`Payment Gateway Error: ${descripton}`);
    }

    if (!razorpayOrder || !razorpayOrder.id) {
        console.error('[payment/create-order] Razorpay order creation failed with empty response');
        res.status(500);
        throw new Error('Failed to create Razorpay order. The gateway returned an empty response.');
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
            
            console.log(`[payment/verify] Reducing stock for asset ${item.asset} by ${qty}`);
            
            const updatedAsset = await Asset.findByIdAndUpdate(
                item.asset,
                { $inc: { stock: -qty, sold: qty } },
                { new: true, runValidators: true }
            );

            if (!updatedAsset) {
                console.error(`[payment/verify] FAILED to find/update asset ${item.asset}`);
            } else {
                console.log(`[payment/verify] Asset ${item.asset} stock updated. New stock: ${updatedAsset.stock}`);
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
                
                await Asset.findByIdAndUpdate(
                    item.asset,
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

/**
 * @route   GET /api/payment/health
 * @access  Public
 * Purpose: Diagnostic endpoint to verify Razorpay and Session configuration on Render.
 */
const getPaymentHealth = asyncHandler(async (req, res) => {
    const health = {
        razorpayKeyId: process.env.RAZORPAY_KEY_ID ? 'present' : 'missing',
        razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ? 'present' : 'missing',
        razorpayInstance: razorpayInstance ? 'initialized' : 'failed',
        sessionCookieConfig: {
            secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        },
        corsOrigins: process.env.CORS_ORIGIN || '*',
        testOrder: 'pending'
    };

    // Attempt a test order creation with Razorpay
    if (razorpayInstance) {
        try {
            const testOrder = await razorpayInstance.orders.create({
                amount: 100, // 1 INR
                currency: 'INR',
                receipt: `health_check_${Date.now()}`
            });
            health.testOrder = testOrder.id ? 'pass' : 'fail';
        } catch (err) {
            health.testOrder = `fail: ${err.message}`;
        }
    } else {
        health.testOrder = 'not_attempted: instance_missing';
    }

    res.status(200).json(health);
});

module.exports = {
    createOrder,
    verifyPayment,
    webhook,
    getPaymentHealth
};
