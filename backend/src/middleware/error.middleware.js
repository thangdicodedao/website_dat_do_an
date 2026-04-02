const ApiResponse = require('../utils/ApiResponse');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // MySQL Duplicate Key Error (error code 1062)
  if (err.code === 'ER_DUP_ENTRY' || err.code === 1062) {
    const field = err.message.match(/for key '([^']+)'/)?.[1] || 'field';
    return ApiResponse.error(res, `${field} đã được sử dụng`, 400);
  }

  // MySQL connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
    return ApiResponse.serverError(res, 'Không thể kết nối đến cơ sở dữ liệu');
  }

  // MySQL invalid data
  if (err.code === 'ER_BAD_NULL_ERROR' || err.code === 'ER_NO_REFERENCED_ROW_2') {
    return ApiResponse.error(res, 'Dữ liệu không hợp lệ', 400);
  }

  // Validation errors (from our own checks)
  if (err.statusCode) {
    return ApiResponse.error(res, err.message, err.statusCode);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.unauthorized(res, 'Token không hợp lệ');
  }
  if (err.name === 'TokenExpiredError') {
    return ApiResponse.unauthorized(res, 'Token đã hết hạn');
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return ApiResponse.serverError(res, message);
};

module.exports = errorHandler;
