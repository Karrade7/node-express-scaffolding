// first step is to set the abosolute path of the application
// this makes includes cleaner in the future as they cab be relative to the overall application, not which foler uou are in.
// this can be re-used later for clean includes that don't have require(../services/file) in some cases and require(services/file) in others
// instead they are all require(path.join(ABSOLUTE_PATH, 'services/file'));
const path = require("path"); // module to read paths on the server
global.ABSOLUTE_PATH = path.resolve(__dirname); // set a consistent path for cleaner require commands

// Common Modules used in all modules
("use strict");
const config = require("config"); // Load config first
const logger = require("winston"); // load winston as logger
const errorHandler = require(path.join(ABSOLUTE_PATH, "util/errorHandler.js")); // load error routines

// Modules for this module
// const https = require('https'); // needed to start https server
// const fs = require('fs'); // needed to read local certs for https

// Configure the logger
require(path.join(ABSOLUTE_PATH, "util/logger.js"));

// Configure authentication
require(path.join(ABSOLUTE_PATH, "util/authentication.js"));

// Configure the express app
var app = require(path.join(ABSOLUTE_PATH, "util/expressapp.js"));

// Now that the app is configured
// Let's start the app
// const PORT = process.env.PORT || config?.app?.port || 3000; // use either the port from environment, config file or default of 3000
const PORT = 3000;

// https can be enabled with certs for localhost
// creating a cert: openssl req -new -newkey rsa:2048 -x509 -nodes -days 390 -sha256 -keyout "server.key" -out "server.crt" -subj "/C=us/CN=localhost.local" -addext "subjectAltName = DNS:localhost"
// see docs for more details
if (config.get("server.SECURE")) {
  const server = https.createServer(
    {
      // key: fs.readFileSync('server.key'),
      // cert: fs.readFileSync('server.cert')
    },
    app
  );
} else {
  const http = require("http");
  const server = http.createServer(app);
}

const http = require("http");
var server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`App listening on port ${PORT}!`);
});
