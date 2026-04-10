const ApiResponse = require('../utils/ApiResponse');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    return ApiResponse.error(res, messages.join(', '), 400);
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'field';
    return ApiResponse.error(res, `${field} đã được sử dụng`, 400);
  }

  // Sequelize foreign key error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return ApiResponse.error(res, 'Dữ liệu không hợp lệ', 400);
  }

  // MySQL connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
    return ApiResponse.serverError(res, 'Không thể kết nối đến cơ sở dữ liệu');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.unauthorized(res, 'Token không hợp lệ');
  }
  if (err.name === 'TokenExpiredError') {
    return ApiResponse.unauthorized(res, 'Token đã hết hạn');
  }

  // Payload too large (e.g. base64 image upload)
  if (err.type === 'entity.too.large' || err.name === 'PayloadTooLargeError') {
    return ApiResponse.error(res, 'Dữ liệu gửi lên quá lớn, vui lòng chọn ảnh nhỏ hơn', 413);
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return ApiResponse.serverError(res, message);
};

module.exports = errorHandler;
