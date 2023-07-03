require('dotenv').config();
const express = require('express');
const expressWinston = require('express-winston');
const winston = require('winston');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const { getChatCompletion } = require('./controller/openaiController');
const { messageSchema } = require('./utils/schema.joi');

const app = express();

const promptsData = JSON.parse(fs.readFileSync(path.resolve(__dirname, './utils/data.json'), 'utf8'));

app.use(cors());

app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
}));

app.use(express.json());

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
}));

app.post('/api/chat/completion', async (req, res) => {
  const { error } = messageSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { category } = req.body;
    
    if (!promptsData.prompts[category]) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const prompts = promptsData.prompts[category];
    const message = prompts[Math.floor(Math.random() * prompts.length)];

    const completion = await getChatCompletion(message);

    res.json({ completion });
  } catch (error) {
    winston.error(error); 
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});

let server;

if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  server = app.listen(port, () => {
    winston.info(`Server listening at http://localhost:${port}`); 
  });
}

module.exports = server;