const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const { speechSchema } = require('../validation/tts.validation');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateSpeech = (req, res) => {
  const { text, voice } = req.body;

  const { error } = speechSchema.validate({ text });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  new Promise((resolve, reject) => {
    openai.audio.speech
      .create({
        model: 'tts-1',
        voice: voice || 'alloy',
        input: text,
      })
      .then(async (mp3) => {
        try {
          const buffer = Buffer.from(await mp3.arrayBuffer());
          const filePath = path.resolve(`./public/speech-${Date.now()}.mp3`);
          await fs.promises.writeFile(filePath, buffer);
          res.json({
            message: 'Speech generated successfully',
            file: `/public${filePath.split('public')[1]}`,
          });
          resolve();
        } catch (writeError) {
          console.error(writeError);
          res.status(500).json({ error: 'Error writing the file' });
          reject(writeError);
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
        reject(error);
      });
  });
};

module.exports = { generateSpeech };