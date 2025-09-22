const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const RefreshToken = sequelize.define('RefreshToken', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  token_hash: { type: DataTypes.TEXT, allowNull: false },
  expires_at: { type: DataTypes.DATE, allowNull: false },
  revoked: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'refresh_tokens',
  timestamps: false
});

User.hasMany(RefreshToken, { foreignKey: 'user_id' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

module.exports = RefreshToken;
