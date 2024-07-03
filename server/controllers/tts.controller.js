const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const { speechSchema } = require('../validation/tts.validation');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const speechFile = path.resolve('./speech.mp3');

const generateSpeech = (req, res) => {
  const { text } = req.body;

  const { error } = speechSchema.validate({ text });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  new Promise((resolve, reject) => {
    openai.audio.speech
      .create({
        model: 'tts-1',
        voice: 'alloy',
        input: text,
      })
      .then(async (mp3) => {
        try {
          console.log(speechFile);
          const buffer = Buffer.from(await mp3.arrayBuffer());
          await fs.promises.writeFile(speechFile, buffer);
          res.json({
            message: 'Speech generated successfully',
            file: speechFile,
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