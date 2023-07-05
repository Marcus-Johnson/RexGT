const express = require('express');
const router = express.Router();
const { getChatCompletion } = require('../controllers/message.controller');
const { messageSchema } = require('../utils/message-schema.joi');
const fs = require('fs');
const path = require('path');
const winston = require('winston');
const promptsData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/message.prompts.json'), 'utf8'));

router.post("/generate_text", async (req, res) => {
    const { error } = messageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    try {
      const { category } = req.body;
  
      if (!promptsData.prompts[category]) {
        return res.status(400).json({ error: "Invalid category" });
      }
  
      const prompts = promptsData.prompts[category];
      const message = prompts[Math.floor(Math.random() * prompts.length)];
  
      const completion = await getChatCompletion(message);
  
      res.json({ completion });
    } catch (error) {
      winston.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while processing the request" });
    }
});

module.exports = router;