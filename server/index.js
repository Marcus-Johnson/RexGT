require('dotenv').config();
const express = require('express');
const cors = require('cors');
const winston = require('winston');
const expressWinston = require('express-winston');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const middlewares = require('./middleware/config.winston');

const speechRoutes = require('./routes/tts.route');
const chatRoutes = require('./routes/stream_chat.route');
const imageRoutes = require('./routes/prompt_image.route');
const categoryChatRoutes = require('./routes/category_chat.route');

const player = require('play-sound')(opts = {});

const path = require('path');
const { exec } = require('child_process');
const readline = require('readline');

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

app.use('/api', chatRoutes);
app.use('/api', imageRoutes);
app.use('/api', speechRoutes);
app.use('/api', categoryChatRoutes);

let server;

const postmanPath = path.join(process.env.USERPROFILE, 'AppData', 'Local', 'Postman', 'Postman.exe');

const carFrames = [
  "    ____    \n __/  |_ \\_ \n|  _     _`-.\n'-(_)---(_)--'",
  "     ____   \n  __/  |_ \\_ \n |  _     _`-.\n '-(_)---(_)--'",
  "      ____  \n   __/  |_ \\_ \n  |  _     _`-.\n  '-(_)---(_)--'",
  "       ____ \n    __/  |_ \\_ \n   |  _     _`-.\n   '-(_)---(_)--'",
  "        ____\n     __/  |_ \\_ \n    |  _     _`-.\n    '-(_)---(_)--'",
  "         ____\n      __/  |_ \\_ \n     |  _     _`-.\n     '-(_)---(_)--'",
  "          ____\n       __/  |_ \\_ \n      |  _     _`-.\n      '-(_)---(_)--'",
  "           ____\n        __/  |_ \\_ \n       |  _     _`-.\n       '-(_)---(_)--'",
  "            ____\n         __/  |_ \\_ \n        |  _     _`-.\n        '-(_)---(_)--'",
  "             ____\n          __/  |_ \\_ \n         |  _     _`-.\n         '-(_)---(_)--'",
  "              ____\n           __/  |_ \\_ \n          |  _     _`-.\n          '-(_)---(_)--'",
  "               ____\n            __/  |_ \\_ \n           |  _     _`-.\n           '-(_)---(_)--'",
  "                ____\n             __/  |_ \\_ \n            |  _     _`-.\n            '-(_)---(_)--'",
  "                 ____\n              __/  |_ \\_ \n             |  _     _`-.\n             '-(_)---(_)--'",
  "                  ____\n               __/  |_ \\_ \n              |  _     _`-.\n              '-(_)---(_)--'",
  "                   ____\n                __/  |_ \\_ \n               |  _     _`-.\n               '-(_)---(_)--'",
  "                    ____\n                 __/  |_ \\_ \n                |  _     _`-.\n                '-(_)---(_)--'",
  "                     ____\n                  __/  |_ \\_ \n                 |  _     _`-.\n                 '-(_)---(_)--'",
  "                      ____\n                   __/  |_ \\_ \n                  |  _     _`-.\n                  '-(_)---(_)--'",
  "                       ____\n                    __/  |_ \\_ \n                   |  _     _`-.\n                   '-(_)---(_)--'",
  "                        ____\n                     __/  |_ \\_ \n                    |  _     _`-.\n                    '-(_)---(_)--'",
  "                         ____\n                      __/  |_ \\_ \n                     |  _     _`-.\n                     '-(_)---(_)--'",
  "                          ____\n                       __/  |_ \\_ \n                      |  _     _`-.\n                      '-(_)---(_)--'",
  "                           ____\n                        __/  |_ \\_ \n                       |  _     _`-.\n                       '-(_)---(_)--'",
  "                            ____\n                         __/  |_ \\_ \n                        |  _     _`-.\n                        '-(_)---(_)--'",
  "                             ____\n                          __/  |_ \\_ \n                         |  _     _`-.\n                         '-(_)---(_)--'",
  "                              ____\n                           __/  |_ \\_ \n                          |  _     _`-.\n                          '-(_)---(_)--'",
  "                               ____\n                            __/  |_ \\_ \n                           |  _     _`-.\n                           '-(_)---(_)--'",
  "                                ____\n                             __/  |_ \\_ \n                            |  _     _`-.\n                            '-(_)---(_)--'",
  "                                 ____\n                              __/  |_ \\_ \n                             |  _     _`-.\n                             '-(_)---(_)--'",
  "                                  ____\n                               __/  |_ \\_ \n                              |  _     _`-.\n                              '-(_)---(_)--'",
  "                                   ____\n                                __/  |_ \\_ \n                               |  _     _`-.\n                               '-(_)---(_)--'",
  "                                    ____\n                                 __/  |_ \\_ \n                                |  _     _`-.\n                                '-(_)---(_)--'"
];

let frameIndex = 0;

if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  server = app.listen(port, () => {
    const printAnimation = () => {
      readline.cursorTo(process.stdout, 0, 0);
      readline.clearScreenDown(process.stdout);
      console.log(carFrames[frameIndex]);
      frameIndex = (frameIndex + 1) % carFrames.length;
    };

    const interval = setInterval(printAnimation, 200);

    setTimeout(() => {
      clearInterval(interval);
      readline.cursorTo(process.stdout, 0, 0);
      readline.clearScreenDown(process.stdout);

      if (process.env.POSTMAN_AUTO === 'YES') {
        exec(`"${postmanPath}"`, (err) => {
          if (err) {
            console.error(`Could not open Postman: ${err}`);
          }
        });
      }

      if (process.env.PLAY_MP3 === 'YES') {
        player.play('./assets/RexOn.mp3', (err) => {
          if (err) console.error(`Huh oh! RexGT could not find RexOn.mp3, ${err}`);
        });
      }

      console.log(`RexGT 0.3 is active: http://localhost:${port}`);
    }, 2400);
  });
}

module.exports = server;