const express = require('express');
const router = express.Router();

const {
  register,
  verifyEmail,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  refreshToken,
  resendCode,
  changePassword,
} = require('../controllers/authController');

const protect = require('../middleware/auth.middleware');

// Public routes
router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);
router.post('/resend-code', resendCode);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getCurrentUser);
router.post('/change-password', protect, changePassword);

module.exports = router;
