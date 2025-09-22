const DocumentsCategory = require('../models/DocumentsCategory');

class CategoryController {
  static async list(req, res) {
    try {
      const cats = await DocumentsCategory.findAll();
      res.json(cats);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const { name, description } = req.body;
      const cat = await DocumentsCategory.create({ name, description });
      res.status(201).json(cat);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = CategoryController;
