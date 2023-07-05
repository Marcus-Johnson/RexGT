const axios = require('axios');
const winston = require('winston');
const openAIUrl = 'https://api.openai.com/v1/chat/completions';
const openAIKey = process.env.OPENAI_KEY;

async function getChatCompletion(message) {
  try {
    const response = await axios.post(
      openAIUrl,
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAIKey}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    winston.error(error);
    throw new Error('An error occurred while communicating with the OpenAI API');
  }
}

module.exports = {
  getChatCompletion
};