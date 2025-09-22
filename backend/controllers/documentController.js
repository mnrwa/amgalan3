const DocumentService = require('../services/documentService');

class DocumentController {
  static async getAll(req, res) {
    try {
      const docs = await DocumentService.getAll(req.userId);
      res.json(docs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const payload = req.body || {};
      if (req.file) {
        const isImage = (req.file.mimetype || '').startsWith('image/');
        const host = req.protocol + '://' + req.get('host');
        if (isImage) payload.image_path = host + `/uploads/${req.file.filename}`;
        else payload.file_path = host + `/uploads/${req.file.filename}`;
      }
      const doc = await DocumentService.create(req.userId, payload);
      res.status(201).json(doc);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const payload = req.body || {};
      if (req.file) {
        const isImage = (req.file.mimetype || '').startsWith('image/');
        const host = req.protocol + '://' + req.get('host');
        if (isImage) payload.image_path = host + `/uploads/${req.file.filename}`;
        else payload.file_path = host + `/uploads/${req.file.filename}`;
      }
      const doc = await DocumentService.update(req.userId, req.params.id, payload);
      res.json(doc);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const result = await DocumentService.delete(req.userId, req.params.id);
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }
}

module.exports = DocumentController;
