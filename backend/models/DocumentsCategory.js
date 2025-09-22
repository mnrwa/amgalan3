const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DocumentsCategory = sequelize.define('DocumentsCategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.TEXT, allowNull: false },
  description: { type: DataTypes.TEXT }
}, {
  tableName: 'documents_category',
  timestamps: false
});

module.exports = DocumentsCategory;
