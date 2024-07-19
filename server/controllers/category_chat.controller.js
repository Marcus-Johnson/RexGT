const OpenAI = require("openai");
const { categoryChatSchema } = require("../validation/category_chat.validation");
const roles = require("../data/roles.attribute.json");
const prompts = require("../data/message.prompts.json");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getCategoryChatCompletion = (req, res) => {
  const { role, category } = req.body;

  const { error } = categoryChatSchema.validate({ role, category });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const categoryPrompts = prompts.prompts[category];
  const randomPrompt =
    categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)];
  const prompt = `As a ${role}, ${randomPrompt}`;

  new Promise((resolve, reject) => {
    openai.chat.completions
      .create({
        model: "gpt-4o-mini",
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

module.exports = { getCategoryChatCompletion };