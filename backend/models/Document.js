const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const DocumentsCategory = require('./DocumentsCategory');

const Document = sequelize.define('Document', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.TEXT, allowNull: false },
  description: { type: DataTypes.TEXT },
  file_path: { type: DataTypes.TEXT },
  image_path: { type: DataTypes.TEXT },
  category_id: { type: DataTypes.INTEGER }
}, {
  tableName: 'documents',
  timestamps: false
});

User.hasMany(Document, { foreignKey: 'user_id' });
Document.belongsTo(User, { foreignKey: 'user_id' });

DocumentsCategory.hasMany(Document, { foreignKey: 'category_id' });
Document.belongsTo(DocumentsCategory, { foreignKey: 'category_id' });

module.exports = Document;
