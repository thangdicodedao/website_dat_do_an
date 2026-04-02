const ApiResponse = require('../utils/ApiResponse');

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return ApiResponse.unauthorized(res, 'Bạn chưa đăng nhập');
  }
  if (req.user.role !== 'admin') {
    return ApiResponse.forbidden(res, 'Bạn không có quyền truy cập');
  }
  next();
};

module.exports = adminOnly;
