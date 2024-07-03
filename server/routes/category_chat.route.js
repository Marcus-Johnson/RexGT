const express = require('express');
const router = express.Router();
const { getCategoryChatCompletion } = require('../controllers/category_chat.controller');

router.post('/category_chat', getCategoryChatCompletion);

module.exports = router;