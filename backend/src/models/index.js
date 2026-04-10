const { sequelize } = require('../config/database');
const User = require('./User');
const Address = require('./Address');
const Category = require('./Category');

// Associations
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses', onDelete: 'CASCADE' });
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { sequelize, User, Address, Category };
