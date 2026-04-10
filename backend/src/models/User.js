const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_verified',
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  verificationCode: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'verification_code',
  },
  verificationCodeExpires: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'verification_code_expires',
  },
  resetPasswordCode: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'reset_password_code',
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'reset_password_expires',
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'refresh_token',
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Instance method: compare password
User.prototype.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// Instance method: to safe JSON
User.prototype.toSafeJSON = function () {
  const data = this.toJSON();

  // Normalize timestamp fields for frontend consumers.
  data.createdAt = data.created_at || null;
  data.updatedAt = data.updated_at || null;

  delete data.password;
  delete data.verificationCode;
  delete data.verificationCodeExpires;
  delete data.resetPasswordCode;
  delete data.resetPasswordExpires;
  delete data.refreshToken;
  delete data.created_at;
  delete data.updated_at;
  delete data.__v;
  return data;
};

module.exports = User;
