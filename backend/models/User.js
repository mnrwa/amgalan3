const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    lastname: { type: DataTypes.TEXT },
    email: { type: DataTypes.TEXT, allowNull: false, unique: true },
    password: { type: DataTypes.TEXT, allowNull: false },
    role: { type: DataTypes.TEXT, defaultValue: "user" },
  },
  {
    tableName: "users",
    timestamps: false,
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 12);
      },
    },
  }
);

User.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
