const express = require('express');

const router = express.Router();
const multer = require('multer');
const path = require('path');
const DocumentController = require('../controllers/documentController');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname) || '';
		cb(null, `${Date.now()}${ext}`);
	}
});
const upload = multer({ storage });

router.use(authMiddleware);

router.get('/', DocumentController.getAll);
router.post('/', upload.single('file'), DocumentController.create);
router.put('/:id', upload.single('file'), DocumentController.update);
router.delete('/:id', DocumentController.delete);

module.exports = router;
