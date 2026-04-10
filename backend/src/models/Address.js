const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Address = sequelize.define('Address', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'TP.HCM',
  },
  district: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
  ward: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
  label: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Nhà riêng',
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_default',
  },
}, {
  tableName: 'addresses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Address;
