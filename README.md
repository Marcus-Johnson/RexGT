# RexGT: ChatGPT-powered Chat Service

RexGT is a service boilerplate; utilizing OpenAI's ChatGPT to provide text completions and image generations based on user prompts. It offers a backend API allowing users to interact with the language model and receive text completions and generated images. The service is built using Node.js and Express, providing a scalable and efficient solution for AI-powered applications.

## Features

- **Text Completions**: Send text prompts utilizing categories with the RexGT API and receive text completions powered by OpenAI's ChatGPT.
- **Image Generations**: Send image prompts to the RexGT API and receive URLs of the generated images.
- **Prompt Categories**: RexGT supports multiple prompt categories for text completions, including movie scripts, recipes, short stories, speeches, and more.
- **Flexible Configuration**: Customize the temperature and other parameters of the text completions to fine-tune the output.
- **Validation with Joi**: The API validates the request payloads using the Joi library to ensure data integrity.
- **Error Handling**: Proper error handling is implemented to gracefully handle any errors that occur during communication with the OpenAI API or processing the requests.
- **Testing with Chai**: The project includes automated tests using the Chai assertion library and Chai HTTP plugin to ensure the API functions correctly.

## Installation

1. Clone the repository: `git clone https://github.com/Marcus-Johnson/rexgt.git`
2. Install the dependencies: `npm install`
3. Set up the environment: Create a `.env` file and provide the necessary environment variables, including
   `OPENAI_KEY`,
   `NODE_ENV`.
   `PORT`,
   
5. Start the server: `npm start`

## Content Generation

To generate text, make a POST request to `/api/generate_category_text`. 

To generate an image, make a POST request to `/api/generate_prompt_image`. 

For example, you can use `curls` on the command line as follows:

```bash
curl --location --request POST 'http://localhost:3000/api/generate_category_text' \
--header 'Content-Type: application/json' \
--data-raw '{
  "category": "movie-script"
}'

curl --location --request POST 'http://localhost:3000/api/generate_prompt_image' \
--header 'Content-Type: application/json' \
--data-raw '{
  "prompt": "sunset over the ocean",
  "n": 1,
  "size": "512x512"
}'
