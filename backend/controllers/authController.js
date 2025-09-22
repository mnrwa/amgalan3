const AuthService = require('../services/authService');

class AuthController {
  static async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req, res) {
    try {
      const result = await AuthService.login(req.body);
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  static async getMe(req, res) {
    try {
      const user = await AuthService.getCurrentUser(req.userId);
      res.json({ user });
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }
}

module.exports = AuthController;
