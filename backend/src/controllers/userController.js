const { Op } = require('sequelize');
const { User, sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const ApiResponse = require('../utils/ApiResponse');
const catchAsync = require('../utils/catchAsync');

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
const createUser = catchAsync(async (req, res) => {
  const { email, password, name, phone, role, isVerified, avatar, address } = req.body;

  if (!email || !password || !name || !phone) {
    return ApiResponse.error(res, 'Vui lòng nhập đầy đủ email, mật khẩu, họ tên và số điện thoại', 400);
  }

  if (String(password).length < 6) {
    return ApiResponse.error(res, 'Mật khẩu phải có ít nhất 6 ký tự', 400);
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return ApiResponse.error(res, 'Email đã được sử dụng', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    name,
    phone,
    role: role === 'admin' ? 'admin' : 'user',
    isVerified: isVerified !== undefined ? Boolean(isVerified) : true,
    avatar: avatar || null,
    address: address || null,
  });

  return ApiResponse.created(res, { user: user.toSafeJSON ? user.toSafeJSON() : user }, 'Tạo người dùng thành công');
});

// @desc    Get all users (paginated)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  const where = search
    ? {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
        ],
      }
    : {};

  const { count, rows } = await User.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    limit,
    offset,
    attributes: { exclude: ['password', 'verificationCode', 'verificationCodeExpires', 'resetPasswordCode', 'resetPasswordExpires', 'refreshToken'] },
  });

  const users = rows.map(u => u.toSafeJSON ? u.toSafeJSON() : u);

  return ApiResponse.success(res, {
    users,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = catchAsync(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password', 'verificationCode', 'verificationCodeExpires', 'resetPasswordCode', 'resetPasswordExpires', 'refreshToken'] },
  });
  if (!user) {
    return ApiResponse.notFound(res, 'Người dùng không tồn tại');
  }
  return ApiResponse.success(res, { user: user.toSafeJSON ? user.toSafeJSON() : user });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = catchAsync(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return ApiResponse.notFound(res, 'Người dùng không tồn tại');
  }

  const allowed = ['name', 'phone', 'avatar', 'role', 'isVerified', 'address'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  await user.update(updates);
  return ApiResponse.success(res, { user: user.toSafeJSON ? user.toSafeJSON() : user }, 'Cập nhật người dùng thành công');
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return ApiResponse.notFound(res, 'Người dùng không tồn tại');
  }

  if (String(user.id) === String(req.user.id)) {
    return ApiResponse.error(res, 'Không thể xóa tài khoản của chính bạn', 400);
  }

  await user.destroy();
  return ApiResponse.success(res, null, 'Xóa người dùng thành công');
});

// @desc    Toggle user role
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
const toggleUserRole = catchAsync(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return ApiResponse.notFound(res, 'Người dùng không tồn tại');
  }

  if (String(user.id) === String(req.user.id)) {
    return ApiResponse.error(res, 'Không thể thay đổi vai trò của chính bạn', 400);
  }

  const newRole = user.role === 'admin' ? 'user' : 'admin';
  await user.update({ role: newRole });
  return ApiResponse.success(res, { user: user.toSafeJSON ? user.toSafeJSON() : user }, 'Cập nhật vai trò thành công');
});

// @desc    Get admin stats
// @route   GET /api/users/stats
// @access  Private/Admin
const getAdminStats = catchAsync(async (req, res) => {
  const [rows] = await sequelize.query(
    `SELECT
      COUNT(*) AS totalUsers,
      SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS newUsersToday
     FROM users`
  );

  const totalUsers = Number(rows?.[0]?.totalUsers || 0);
  const newUsersToday = Number(rows?.[0]?.newUsersToday || 0);

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
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return ApiResponse.notFound(res, 'Người dùng không tồn tại');
  }

  const allowed = ['name', 'phone', 'avatar', 'address'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  await user.update(updates);
  return ApiResponse.success(res, { user: user.toSafeJSON ? user.toSafeJSON() : user }, 'Cập nhật hồ sơ thành công');
});

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserRole,
  getAdminStats,
  updateProfile,
};
