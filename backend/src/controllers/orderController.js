const Order = require('../models/Order');
const Asset = require('../models/Asset');
const Cart = require('../models/Cart');
const VaultItem = require('../models/VaultItem');
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
                size: item.size
            })
        );
    await Promise.all(vaultPromises);
};

// ─── Create Order ─────────────────────────────────────────────────────────────

/**
 * @route   POST /api/orders
 * @access  Private
 */
const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items provided');
    }

    // Atomic stock reservation with rollback to prevent race conditions & overselling
    const decrementedItems = [];
    try {
        for (const item of orderItems) {
            const qty = Number(item.quantity);
            if (!qty || qty <= 0) continue;

            const filter = {
                _id: item.asset,
                stock: { $gte: qty }
            };
            const updateObj = { $inc: { stock: -qty, sold: qty } };

            if (item.size && ['S', 'M', 'L', 'XL'].includes(item.size)) {
                filter[`sizes.${item.size}`] = { $gte: qty };
                updateObj.$inc[`sizes.${item.size}`] = -qty;
            }

            const updatedAsset = await Asset.findOneAndUpdate(filter, updateObj, { new: true });
            if (!updatedAsset) {
                const currentAsset = await Asset.findById(item.asset);
                const assetName = currentAsset ? currentAsset.name : 'Selected product';
                throw new Error(`Insufficient stock for: ${assetName}`);
            }

            // Edition number = total sold (after this purchase)
            item.editionNumber = updatedAsset.sold;
            decrementedItems.push({ assetId: item.asset, qty, size: item.size });
        }
    } catch (stockError) {
        // Rollback any items that were already reserved during this failed checkout
        for (const item of decrementedItems) {
            const rollbackObj = { $inc: { stock: item.qty, sold: -item.qty } };
            if (item.size && ['S', 'M', 'L', 'XL'].includes(item.size)) {
                rollbackObj.$inc[`sizes.${item.size}`] = item.qty;
            }
            await Asset.findByIdAndUpdate(item.assetId, rollbackObj);
        }
        res.status(400);
        throw new Error(stockError.message);
    }

    const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentMethod: paymentMethod || 'ONLINE',
        itemsPrice: itemsPrice || 0,
        shippingPrice: shippingPrice || 0,
        taxPrice: taxPrice || 0,
        totalAmount,
    });

    // Clear the user's cart after order is placed
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json(order);
});

// ─── Get Order by ID ──────────────────────────────────────────────────────────

/**
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'username email');

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Only owner or admin can view
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to view this order');
    }

    res.json(order);
});

// ─── Get My Orders ────────────────────────────────────────────────────────────

/**
 * @route   GET /api/orders/myorders
 * @access  Private
 */
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json(orders);
});

// ─── Get All Orders (Admin) ───────────────────────────────────────────────────

/**
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'username email').sort({ createdAt: -1 }).lean();
    res.json(orders);
});

// ─── Update Order to Paid ─────────────────────────────────────────────────────

/**
 * @route   PUT /api/orders/:id/pay
 * @access  Private
 */
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'Confirmed';
    order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        updateTime: req.body.update_time,
        emailAddress: req.body.payer?.email_address,
    };

    const updatedOrder = await order.save();

    // Auto-generate vault items after payment
    await generateVaultItems(updatedOrder);

    res.json(updatedOrder);
});

// ─── Update Order Status (Admin) ──────────────────────────────────────────────

/**
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status, trackingId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.status = status || order.status;
    if (trackingId) order.trackingId = trackingId;

    if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
});

module.exports = {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderToPaid,
    updateOrderStatus,
};
