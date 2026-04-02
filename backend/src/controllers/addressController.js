const Address = require('../models/Address');
const ApiResponse = require('../utils/ApiResponse');
const catchAsync = require('../utils/catchAsync');

// @desc    Get all addresses for current user
// @route   GET /api/addresses
// @access  Private
const getAddresses = catchAsync(async (req, res) => {
  const addresses = await Address.findByUser(req.user.id);
  return ApiResponse.success(res, { addresses });
});

// @desc    Create address
// @route   POST /api/addresses
// @access  Private
const createAddress = catchAsync(async (req, res) => {
  const address = await Address.create({
    userId: req.user.id,
    ...req.body,
  });
  return ApiResponse.created(res, { address }, 'Thêm địa chỉ thành công');
});

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = catchAsync(async (req, res) => {
  const address = await Address.update(req.params.id, req.user.id, req.body);
  if (!address) {
    return ApiResponse.notFound(res, 'Địa chỉ không tồn tại');
  }
  return ApiResponse.success(res, { address }, 'Cập nhật địa chỉ thành công');
});

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = catchAsync(async (req, res) => {
  const existing = await Address.findByIdAndUser(req.params.id, req.user.id);
  if (!existing) {
    return ApiResponse.notFound(res, 'Địa chỉ không tồn tại');
  }

  await Address.delete(req.params.id, req.user.id);
  return ApiResponse.success(res, null, 'Xóa địa chỉ thành công');
});

// @desc    Set default address
// @route   PATCH /api/addresses/:id/default
// @access  Private
const setDefaultAddress = catchAsync(async (req, res) => {
  const address = await Address.setDefault(req.params.id, req.user.id);
  if (!address) {
    return ApiResponse.notFound(res, 'Địa chỉ không tồn tại');
  }
  return ApiResponse.success(res, { address }, 'Đặt địa chỉ mặc định thành công');
});

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
