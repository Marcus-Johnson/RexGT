const axios = require('axios');
const openAIUrl = 'https://api.openai.com/v1/images/generations';

async function generateImage(prompt, n, size) {
  try {
    const response = await axios.post(openAIUrl, {
      prompt,
      n,
      size
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_KEY}`
      }
    });

    return response.data.data[0].url;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while generating the image');
  }
}

module.exports = {
  generateImage
};
