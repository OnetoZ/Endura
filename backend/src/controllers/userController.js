const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
});

/**
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.json(user);
});

/**
 * @route   PUT /api/users/:id/role
 * @access  Private/Admin
 */
const updateUserRole = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.role = req.body.role || user.role;
    await user.save();
    res.json({ message: 'User role updated', role: user.role });
});

/**
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.role === 'admin') {
        res.status(400);
        throw new Error('Cannot delete an admin account');
    }

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User deleted successfully' });
});

/**
 * @route   GET /api/users/dashboard/stats
 * @access  Private/Admin
 */
const getDashboardStats = asyncHandler(async (req, res) => {
    const [totalUsers, totalOrders, totalProducts, orders] = await Promise.all([
        User.countDocuments(),
        Order.countDocuments(),
        Product.countDocuments({ isActive: true }),
        Order.find({ isPaid: true }),
    ]);

    const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);

    const recentOrders = await Order.find({})
        .populate('user', 'username email')
        .sort({ createdAt: -1 })
        .limit(5);

    res.json({
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue,
        recentOrders,
    });
});

module.exports = { getAllUsers, getUserById, updateUserRole, deleteUser, getDashboardStats };
