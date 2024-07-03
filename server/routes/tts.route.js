const express = require('express');
const router = express.Router();
const { generateSpeech } = require('../controllers/tts.controller');

router.post('/speech', generateSpeech);

module.exports = router;