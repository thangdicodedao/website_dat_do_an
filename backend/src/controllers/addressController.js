const { Op } = require('sequelize');
const { Address } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const catchAsync = require('../utils/catchAsync');

// @desc    Get all addresses for current user
// @route   GET /api/addresses
// @access  Private
const getAddresses = catchAsync(async (req, res) => {
  const addresses = await Address.findAll({
    where: { userId: req.user.id },
    order: [['isDefault', 'DESC'], ['createdAt', 'DESC']],
  });
  return ApiResponse.success(res, { addresses });
});

// @desc    Create address
// @route   POST /api/addresses
// @access  Private
const createAddress = catchAsync(async (req, res) => {
  // If setting default, clear others first
  if (req.body.isDefault) {
    await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
  } else {
    const count = await Address.count({ where: { userId: req.user.id } });
    if (count === 0) req.body.isDefault = true;
  }

  const address = await Address.create({ userId: req.user.id, ...req.body });
  return ApiResponse.created(res, { address }, 'Thêm địa chỉ thành công');
});

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = catchAsync(async (req, res) => {
  const address = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!address) {
    return ApiResponse.notFound(res, 'Địa chỉ không tồn tại');
  }

  // If setting as default, clear others
  if (req.body.isDefault && !address.isDefault) {
    await Address.update({ isDefault: false }, { where: { userId: req.user.id, id: { [Op.ne]: req.params.id } } });
  }

  const allowed = ['name', 'phone', 'address', 'city', 'district', 'ward', 'label', 'isDefault'];
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      address[key] = req.body[key];
    }
  }
  await address.save();

  return ApiResponse.success(res, { address }, 'Cập nhật địa chỉ thành công');
});

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = catchAsync(async (req, res) => {
  const address = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!address) {
    return ApiResponse.notFound(res, 'Địa chỉ không tồn tại');
  }

  const wasDefault = address.isDefault;
  await address.destroy();

  // If deleted was default, promote the earliest remaining
  if (wasDefault) {
    const next = await Address.findOne({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    if (next) {
      await next.update({ isDefault: true });
    }
  }

  return ApiResponse.success(res, null, 'Xóa địa chỉ thành công');
});

// @desc    Set default address
// @route   PATCH /api/addresses/:id/default
// @access  Private
const setDefaultAddress = catchAsync(async (req, res) => {
  const address = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!address) {
    return ApiResponse.notFound(res, 'Địa chỉ không tồn tại');
  }

  await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
  await address.update({ isDefault: true });

  return ApiResponse.success(res, { address }, 'Đặt địa chỉ mặc định thành công');
});

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
