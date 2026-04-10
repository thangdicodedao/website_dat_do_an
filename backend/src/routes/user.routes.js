const express = require('express');
const router = express.Router();

const {
  createUser,
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
router.post('/', protect, adminOnly, createUser);
router.get('/', protect, adminOnly, getUsers);
router.get('/stats', protect, adminOnly, getAdminStats);
// User profile route (must be before /:id)
router.put('/profile', protect, updateProfile);
router.get('/:id', protect, adminOnly, getUserById);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);
router.patch('/:id/role', protect, adminOnly, toggleUserRole);

module.exports = router;
