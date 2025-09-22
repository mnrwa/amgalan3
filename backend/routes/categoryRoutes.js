const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');

router.get('/', CategoryController.list);
router.post('/', CategoryController.create);

module.exports = router;
