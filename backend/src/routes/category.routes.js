const express = require('express');
const router = express.Router();

const {
  getCategories,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const protect = require('../middleware/auth.middleware');
const adminOnly = require('../middleware/admin.middleware');

// Public routes
router.get('/', getCategories);
router.get('/slug/:slug', getCategoryBySlug);

// Admin routes
router.get('/all', protect, adminOnly, getAllCategories);
router.get('/:id', protect, adminOnly, getCategoryById);
router.post('/', protect, adminOnly, createCategory);
router.put('/:id', protect, adminOnly, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
