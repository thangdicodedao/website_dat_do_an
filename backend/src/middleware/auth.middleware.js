const { User } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const { verifyAccessToken } = require('../utils/generateToken');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return ApiResponse.unauthorized(res, 'Bạn chưa đăng nhập');
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return ApiResponse.unauthorized(res, 'Tài khoản không tồn tại');
    }
    req.user = user.toSafeJSON();
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(res, 'Phiên đăng nhập đã hết hạn');
    }
    if (error.name === 'JsonWebTokenError') {
      return ApiResponse.unauthorized(res, 'Token không hợp lệ');
    }
    return ApiResponse.unauthorized(res, 'Xác thực thất bại');
  }
};

module.exports = protect;
