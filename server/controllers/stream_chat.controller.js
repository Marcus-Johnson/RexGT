const OpenAI = require('openai');
const { chatSchema } = require('../validation/stream_chat.validation');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getChatCompletion = (req, res) => {
  const { prompt } = req.body;

  const { error } = chatSchema.validate({ prompt });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  new Promise((resolve, reject) => {
    openai.chat.completions
      .create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
      })
      .then((completion) => {
        res.json(completion.choices[0]);
        resolve();
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
        reject(error);
      });
  });
};

module.exports = { getChatCompletion };