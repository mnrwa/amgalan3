const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');

class AuthService {
  static generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  }

  static async register({ username, email, password }) {
    const existing = await User.findOne({ where: { [Op.or]: [{ email }, { name: username }] } });
    if (existing) throw new Error('User already exists');

    const user = await User.create({ name: username, email, password });
    const token = this.generateToken(user.id);
    return { user: { id: user.id, username: user.name, email: user.email, role: user.role }, token };
  }

  static async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      throw new Error('Invalid email or password');
    }
  const token = this.generateToken(user.id);
  return { user: { id: user.id, username: user.name, email: user.email, role: user.role }, token };
  }

  static async getCurrentUser(userId) {
    const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
    if (!user) throw new Error('User not found');
    return user;
  }
}

module.exports = AuthService;
