const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUserRole, deleteUser, getDashboardStats } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

// All user management routes are admin-only
router.get('/dashboard/stats', protect, admin, getDashboardStats);
router.get('/', protect, admin, getAllUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id/role', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
