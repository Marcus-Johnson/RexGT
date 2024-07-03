const express = require('express');
const router = express.Router();
const { generateImage } = require('../controllers/prompt_image.controller');

router.post('/image', generateImage);

module.exports = router;