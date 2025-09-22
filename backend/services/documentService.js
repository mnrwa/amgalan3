const Document = require('../models/Document');

class DocumentService {
  static async getAll(userId) {
    return await Document.findAll({ where: { user_id: userId } });
  }

  static async create(userId, { title, content, description, category_id, file_path, image_path }) {
    try {
      return await Document.create({ user_id: userId, title: title || 'Untitled', description: description || null, file_path: file_path || null, image_path: image_path || null, category_id: category_id || null });
    } catch (err) {
      console.error('DocumentService.create error', err);
      throw err;
    }
  }

  static async update(userId, id, { title, content, description, category_id }) {
    const doc = await Document.findOne({ where: { id, user_id: userId } });
    if (!doc) throw new Error('Document not found');
    return await doc.update({ title: title ?? doc.title, description: description ?? doc.description, category_id: category_id ?? doc.category_id });
  }

  static async delete(userId, id) {
    const doc = await Document.findOne({ where: { id, user_id: userId } });
    if (!doc) throw new Error('Document not found');
    await doc.destroy();
    return { message: 'Deleted successfully' };
  }
}

module.exports = DocumentService;
