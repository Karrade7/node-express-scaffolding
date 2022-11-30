"use strict";

// first step is to set the abosolute path of the application
// this makes includes cleaner in the future as they cab be relative to the overall application, not which foler uou are in.
// this can be re-used later for clean includes that don't have require(../services/file) in some cases and require(services/file) in others
// instead they are all require(path.join(ABSOLUTE_PATH, 'services/file'));
const path = require("path"); // module to read paths on the server
//mconst ABSOLUTE_PATH: string = path.resolve(__dirname); // set a consistent path for cleaner require commands
declare global {
  var ABSOLUTE_PATH: string;
}
global.ABSOLUTE_PATH = path.resolve(__dirname);

// Configure environment variables
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

// Common Modules used in all modules
process.env["NODE_CONFIG_DIR"] = path.join(ABSOLUTE_PATH, "config");
const appConfig = require("config"); // Load config first
const logger = require("winston"); // load winston as logger
const errorHandler = require("./util/errorHandler"); // load error routines

// Modules for this module
const https = require("https"); // needed to start https server
const fs = require("fs"); // needed to read local certs for https

// Configure the logger
require("./util/logger");

// Configure authentication
require("./util/authentication");

// Configure the express app
var app = require("./util/expressapp");

// Now that the app is configured
// Let's start the app
var PORT = process.env.PORT || appConfig?.server?.PORT || 3000; // use either the port from environment, config file or default of 3000
// const PORT = 3000;
if (appConfig.get("server.SECURE")) {
  var server = https.createServer(
    {
      key: fs.readFileSync(path.join(ABSOLUTE_PATH, "config/server.key")),
      cert: fs.readFileSync(path.join(ABSOLUTE_PATH, "config/server.crt")),
    },
    app
  );
} else {
  const http = require("http");
  var server = http.createServer(app);
}

server.listen(PORT, () => {
  logger.info(`App listening on port ${PORT}!`);
});

export {};
