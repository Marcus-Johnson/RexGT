# RexGT: ChatGPT-powered Chat Service

RexGT is a chat service that leverages OpenAI's ChatGPT to provide chat completions based on various prompts. It offers a backend API that allows users to interact with the language model and receive chat responses. The service is built with Node.js and Express, providing a scalable and efficient solution for chat-based applications.

## Features

- **Chat Completions**: Send prompts to the RexGT API and receive chat completions powered by OpenAI's ChatGPT.
- **Prompt Categories**: RexGT supports multiple prompt categories, including movie scripts, recipes, short stories, speeches, biographies, song lyrics, poetry, news articles, book reviews, tutorials, travel guides, personal letters, resumes, cover letters, business proposals, research papers, lesson plans, press releases, interviews, and product descriptions.
- **Flexible Configuration**: Customize the temperature and other parameters of the chat completions to fine-tune the output.
- **Validation with Joi**: The API validates the request payloads using the Joi library to ensure the category parameter is valid.
- **Error Handling**: Proper error handling is implemented to gracefully handle any errors that occur during communication with the OpenAI API or processing the requests.
- **Testing with Chai**: The project includes automated tests using the Chai assertion library and Chai HTTP plugin to ensure the API functions correctly.

## Installation

1. Clone the repository: `git clone https://github.com/Marcus-Johnson/rexgt.git`
2. Install the dependencies: `npm install`
3. Set up the environment: Create a `.env` file and provide the necessary environment variables, including `OPENAI_KEY`.
4. Start the server: `npm start`

## Usage

1. Make a POST request to `/api/chat/completion` with the following payload:

```json
{
  "category": "movie-script"
}

