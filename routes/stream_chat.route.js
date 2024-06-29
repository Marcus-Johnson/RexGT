const express = require('express');
const router = express.Router();
const { getChatCompletion } = require('../controllers/stream_chat.controller');

router.post('/chat', getChatCompletion);

module.exports = router;