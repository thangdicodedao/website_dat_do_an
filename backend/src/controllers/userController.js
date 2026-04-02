const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const catchAsync = require('../utils/catchAsync');

// @desc    Get all users (paginated)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || '';

  const result = await User.findAll({ search, page, limit });
  return ApiResponse.success(res, result);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return ApiResponse.notFound(res, 'Người dùng không tồn tại');
  }
  return ApiResponse.success(res, { user });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = catchAsync(async (req, res) => {
  const user = await User.update(req.params.id, req.body);
  if (!user) {
    return ApiResponse.notFound(res, 'Người dùng không tồn tại');
  }
  return ApiResponse.success(res, { user }, 'Cập nhật người dùng thành công');
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return ApiResponse.notFound(res, 'Người dùng không tồn tại');
  }

  if (user.id === req.user.id) {
    return ApiResponse.error(res, 'Không thể xóa tài khoản của chính bạn', 400);
  }

  await User.delete(req.params.id);
  return ApiResponse.success(res, null, 'Xóa người dùng thành công');
});

// @desc    Toggle user role
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
const toggleUserRole = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return ApiResponse.notFound(res, 'Người dùng không tồn tại');
  }

  if (user.id === req.user.id) {
    return ApiResponse.error(res, 'Không thể thay đổi vai trò của chính bạn', 400);
  }

  const newRole = user.role === 'admin' ? 'user' : 'admin';
  const updated = await User.update(req.params.id, { role: newRole });
  return ApiResponse.success(res, { user: updated }, 'Cập nhật vai trò thành công');
});

// @desc    Get admin stats
// @route   GET /api/users/stats
// @access  Private/Admin
const getAdminStats = catchAsync(async (req, res) => {
  const [totalUsers, newUsersToday] = await Promise.all([
    User.countAll(),
    User.countNewToday(),
  ]);

  return ApiResponse.success(res, {
    totalUsers,
    newUsersToday,
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    totalProducts: 0,
    lowStockProducts: 0,
  });
});

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = catchAsync(async (req, res) => {
  const user = await User.update(req.user.id, req.body);
  if (!user) {
    return ApiResponse.notFound(res, 'Người dùng không tồn tại');
  }
  return ApiResponse.success(res, { user }, 'Cập nhật hồ sơ thành công');
});

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserRole,
  getAdminStats,
  updateProfile,
};
