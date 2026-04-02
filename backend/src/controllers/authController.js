const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const catchAsync = require('../utils/catchAsync');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateTokens, generateAccessToken, verifyRefreshToken } = require('../utils/generateToken');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = catchAsync(async (req, res) => {
  const { email, password, name, phone } = req.body;

  if (!email || !password || !name) {
    return ApiResponse.error(res, 'Vui lòng nhập đầy đủ tên, email và mật khẩu', 400);
  }

  if (String(password).length < 6) {
    return ApiResponse.error(res, 'Mật khẩu phải có ít nhất 6 ký tự', 400);
  }

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return ApiResponse.error(res, 'Email đã được sử dụng', 400);
  }

  const hashedPassword = await hashPassword(password);
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const codeExpires = new Date(Date.now() + 15 * 60 * 1000);

  const user = await User.create({
    email,
    password: hashedPassword,
    name,
    phone,
    verificationCode: code,
    verificationCodeExpires: codeExpires,
  });

  await sendVerificationEmail(email, code);

  return ApiResponse.created(res, { user }, 'Mã xác thực đã được gửi đến email của bạn');
});

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = catchAsync(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return ApiResponse.error(res, 'Email và mã xác thực là bắt buộc', 400);
  }

  const userWithCode = await User.findByEmailWithCode(email, code);
  if (!userWithCode || userWithCode.verification_code !== code) {
    return ApiResponse.error(res, 'Mã xác thực không đúng hoặc đã hết hạn', 400);
  }

  await User.updateVerification(userWithCode.id);

  const tokens = generateTokens(userWithCode.id);
  await User.updateRefreshToken(userWithCode.id, tokens.refreshToken);

  const user = await User.findById(userWithCode.id);
  return ApiResponse.success(res, { user, ...tokens }, 'Xác thực email thành công');
});

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return ApiResponse.error(res, 'Email và mật khẩu là bắt buộc', 400);
  }

  const userRow = await User.findByEmailWithPassword(email);
  if (!userRow) {
    return ApiResponse.error(res, 'Email hoặc mật khẩu không đúng', 401);
  }

  const isMatch = await comparePassword(password, userRow.password);
  if (!isMatch) {
    return ApiResponse.error(res, 'Email hoặc mật khẩu không đúng', 401);
  }

  if (!userRow.is_verified) {
    return ApiResponse.error(res, 'Vui lòng xác thực email trước khi đăng nhập', 403);
  }

  const tokens = generateTokens(userRow.id);
  await User.updateRefreshToken(userRow.id, tokens.refreshToken);

  const user = await User.findById(userRow.id);
  return ApiResponse.success(res, { user, ...tokens }, 'Đăng nhập thành công');
});

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
const logout = catchAsync(async (req, res) => {
  await User.clearRefreshToken(req.user.id);
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

  if (!email) {
    return ApiResponse.error(res, 'Email là bắt buộc', 400);
  }

  const user = await User.findByEmailWithPassword(email);
  if (!user) {
    return ApiResponse.success(res, null, 'Nếu email tồn tại, mã đặt lại mật khẩu sẽ được gửi');
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 15 * 60 * 1000);
  await User.setResetCode(user.id, code, expires);

  await sendPasswordResetEmail(email, code);

  return ApiResponse.success(res, null, 'Nếu email tồn tại, mã đặt lại mật khẩu sẽ được gửi');
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = catchAsync(async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return ApiResponse.error(res, 'Email, mã xác nhận và mật khẩu mới là bắt buộc', 400);
  }

  if (String(newPassword).length < 6) {
    return ApiResponse.error(res, 'Mật khẩu mới phải có ít nhất 6 ký tự', 400);
  }

  const user = await User.findByResetCode(email, code);
  if (!user) {
    return ApiResponse.error(res, 'Mã đặt lại mật khẩu không đúng hoặc đã hết hạn', 400);
  }

  const hashedPassword = await hashPassword(newPassword);
  await User.updatePasswordAndClearReset(user.id, hashedPassword);

  return ApiResponse.success(res, null, 'Đặt lại mật khẩu thành công');
});

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshTokenFn = catchAsync(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return ApiResponse.unauthorized(res, 'Refresh token là bắt buộc');
  }

  try {
    const decoded = verifyRefreshToken(token);
    const userRow = await User.findByIdWithRefreshToken(decoded.userId);

    if (!userRow || userRow.refresh_token !== token) {
      return ApiResponse.unauthorized(res, 'Refresh token không hợp lệ');
    }

    const accessToken = generateAccessToken(userRow.id);
    return ApiResponse.success(res, { accessToken });
  } catch (error) {
    return ApiResponse.unauthorized(res, 'Refresh token không hợp lệ hoặc đã hết hạn');
  }
});

// @desc    Resend code
// @route   POST /api/auth/resend-code
// @access  Public
const resendCode = catchAsync(async (req, res) => {
  const { email, type } = req.body;

  if (!email) {
    return ApiResponse.error(res, 'Email là bắt buộc', 400);
  }

  const user = await User.findByEmailWithPassword(email);
  if (!user) {
    return ApiResponse.success(res, null, 'Mã mới đã được gửi nếu email tồn tại');
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  if (type === 'reset') {
    await User.setResetCode(user.id, code, expires);
    await sendPasswordResetEmail(email, code);
  } else {
    if (user.is_verified) {
      return ApiResponse.error(res, 'Tài khoản đã được xác thực', 400);
    }

    await User.setVerificationCode(user.id, code, expires);
    await sendVerificationEmail(email, code);
  }

  return ApiResponse.success(res, null, 'Mã mới đã được gửi đến email của bạn');
});

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return ApiResponse.error(res, 'Mật khẩu hiện tại và mật khẩu mới là bắt buộc', 400);
  }

  if (String(newPassword).length < 6) {
    return ApiResponse.error(res, 'Mật khẩu mới phải có ít nhất 6 ký tự', 400);
  }

  if (currentPassword === newPassword) {
    return ApiResponse.error(res, 'Mật khẩu mới phải khác mật khẩu hiện tại', 400);
  }

  const userRow = await User.findByIdWithPassword(req.user.id);
  if (!userRow) {
    return ApiResponse.notFound(res, 'Người dùng không tồn tại');
  }

  const isMatch = await comparePassword(currentPassword, userRow._password);
  if (!isMatch) {
    return ApiResponse.error(res, 'Mật khẩu hiện tại không đúng', 400);
  }

  const hashedPassword = await hashPassword(newPassword);
  await User.updatePasswordAndClearRefresh(userRow.id, hashedPassword);

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
  refreshToken: refreshTokenFn,
  resendCode,
  changePassword,
};
