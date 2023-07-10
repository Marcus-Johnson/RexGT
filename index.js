require("dotenv").config();
const express = require("express");
const cors = require("cors");
const winston = require("winston");
const expressWinston = require("express-winston");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const middlewares = require("./middleware/middlewares");

const chatRoutes = require('./routes/category_chat.route');
const imageRoutes = require('./routes/prompt_image.route');

middlewares.checkRequiredEnvironmentVariables();

const app = express();

app.use(cors());

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(express.json());

app.use(expressWinston.logger(middlewares.createWinstonOptions()));

app.use("/api", chatRoutes);
app.use("/api", imageRoutes);

let server;

if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 3000;
  server = app.listen(port, () => {
    winston.info(`Server listening at http://localhost:${port}`);
  });
}

module.exports = server;