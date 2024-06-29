const OpenAI = require('openai');
const { imageSchema } = require('../validation/prompt_image.validation');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateImage = (req, res) => {
  const { prompt } = req.body;

  const { error } = imageSchema.validate({ prompt });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  new Promise((resolve, reject) => {
    openai.images
      .generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      })
      .then((response) => {
        const imageUrl = response.data[0].url;
        res.json({ url: imageUrl });
        resolve();
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
        reject(error);
      });
  });
};

module.exports = { generateImage };