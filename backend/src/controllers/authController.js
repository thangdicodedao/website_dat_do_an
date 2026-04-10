const { Op } = require('sequelize');
const { User } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const catchAsync = require('../utils/catchAsync');
const { hashPassword } = require('../utils/hashPassword');
const { generateTokens, generateAccessToken, verifyRefreshToken } = require('../utils/generateToken');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = catchAsync(async (req, res) => {
  const { email, password, name, phone } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return ApiResponse.error(res, 'Email đã được sử dụng', 400);
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const codeExpires = new Date(Date.now() + 15 * 60 * 1000);

  const user = await User.create({
    email,
    password,
    name,
    phone,
    verificationCode: code,
    verificationCodeExpires: codeExpires,
  });

  await sendVerificationEmail(email, code);

  return ApiResponse.created(res, { user: user.toSafeJSON() }, 'Mã xác thực đã được gửi đến email của bạn');
});

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = catchAsync(async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({
    where: {
      email,
      verificationCode: code,
      verificationCodeExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    return ApiResponse.error(res, 'Mã xác thực không đúng hoặc đã hết hạn', 400);
  }

  await user.update({
    isVerified: true,
    verificationCode: null,
    verificationCodeExpires: null,
  });

  const tokens = generateTokens(user.id);
  await user.update({ refreshToken: tokens.refreshToken });

  return ApiResponse.success(res, { user: user.toSafeJSON(), ...tokens }, 'Xác thực email thành công');
});

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return ApiResponse.error(res, 'Email hoặc mật khẩu không đúng', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return ApiResponse.error(res, 'Email hoặc mật khẩu không đúng', 401);
  }

  if (!user.isVerified) {
    return ApiResponse.error(res, 'Vui lòng xác thực email trước khi đăng nhập', 403);
  }

  const tokens = generateTokens(user.id);
  await user.update({ refreshToken: tokens.refreshToken });

  return ApiResponse.success(res, { user: user.toSafeJSON(), ...tokens }, 'Đăng nhập thành công');
});

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
const logout = catchAsync(async (req, res) => {
  await req.user.update({ refreshToken: null });
  return ApiResponse.success(res, null, 'Đăng xuất thành công');
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = catchAsync(async (req, res) => {
  return ApiResponse.success(res, { user: req.user });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return ApiResponse.success(res, null, 'Nếu email tồn tại, mã đặt lại mật khẩu sẽ được gửi');
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 15 * 60 * 1000);
  await user.update({ resetPasswordCode: code, resetPasswordExpires: expires });

  await sendPasswordResetEmail(email, code);

  return ApiResponse.success(res, null, 'Nếu email tồn tại, mã đặt lại mật khẩu sẽ được gửi');
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = catchAsync(async (req, res) => {
  const { email, code, newPassword } = req.body;

  const user = await User.findOne({
    where: {
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    return ApiResponse.error(res, 'Mã đặt lại mật khẩu không đúng hoặc đã hết hạn', 400);
  }

  const hashedPassword = await hashPassword(newPassword);
  await user.update({
    password: hashedPassword,
    resetPasswordCode: null,
    resetPasswordExpires: null,
    refreshToken: null,
  });

  return ApiResponse.success(res, null, 'Đặt lại mật khẩu thành công');
});

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return ApiResponse.unauthorized(res, 'Refresh token là bắt buộc');
  }

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findByPk(decoded.userId);

    if (!user || user.refreshToken !== token) {
      return ApiResponse.unauthorized(res, 'Refresh token không hợp lệ');
    }

    const accessToken = generateAccessToken(user.id);
    return ApiResponse.success(res, { accessToken });
  } catch {
    return ApiResponse.unauthorized(res, 'Refresh token không hợp lệ hoặc đã hết hạn');
  }
});

// @desc    Resend code
// @route   POST /api/auth/resend-code
// @access  Public
const resendCode = catchAsync(async (req, res) => {
  const { email, type } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return ApiResponse.success(res, null, 'Mã mới đã được gửi nếu email tồn tại');
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  if (type === 'reset') {
    await user.update({ resetPasswordCode: code, resetPasswordExpires: expires });
    await sendPasswordResetEmail(email, code);
  } else {
    await user.update({ verificationCode: code, verificationCodeExpires: expires });
    await sendVerificationEmail(email, code);
  }

  return ApiResponse.success(res, null, 'Mã mới đã được gửi đến email của bạn');
});

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // req.user from middleware is already the safe JSON version, we need the Sequelize instance
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return ApiResponse.notFound(res, 'Người dùng không tồn tại');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return ApiResponse.error(res, 'Mật khẩu hiện tại không đúng', 400);
  }

  const hashedPassword = await hashPassword(newPassword);
  await user.update({ password: hashedPassword, refreshToken: null });

  return ApiResponse.success(res, null, 'Đổi mật khẩu thành công');
});

module.exports = {
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
};
