const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserRole,
  getAdminStats,
  updateProfile,
} = require('../controllers/userController');

const protect = require('../middleware/auth.middleware');
const adminOnly = require('../middleware/admin.middleware');

// Admin routes
router.get('/', protect, adminOnly, getUsers);
router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/:id', protect, adminOnly, getUserById);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);
router.patch('/:id/role', protect, adminOnly, toggleUserRole);

// User profile route
router.put('/profile', protect, updateProfile);

module.exports = router;
