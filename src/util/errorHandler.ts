// requirements for the entire app
"use strict";
const path = require("path"); // module to read paths on the server

process.env["NODE_CONFIG_DIR"] = path.join(ABSOLUTE_PATH, "config");
const config = require("config");
const logger = require("winston"); // Logger being used

// Requirements for this script
import { Application, Request, Response, NextFunction } from "express"; // Common Web application development for NodeJS

function errorHandler(error: Error, res: Response, next: NextFunction) {
  if (error === undefined) {
    const error = new Error("Unknown Error");
    error.stack = "Unknown Stack";
    res.status(500);
  }
  if (!(error instanceof Error)) {
    error = new Error(error);
    error.stack = "Unknown Stack";
    //error = err;
  }
  logger.error(`Error Logged:" ${error.message}`);
  if (res === undefined) {
    logger.error("No Response to send error to. Likely fatal. Exiting");
    process.exit(1);
  }
  if (res === undefined || res?.headersSent) {
    res.write("Error\n");
    res.write(error.message);
    res.write(error.stack);
    res.end();
    logger.error("Exiting");
    process.exit(1);
  }
  res.render("errors/500", { error: Error });
  logger.error("Exiting");
  process.exit(1);
}

// This is a backup error handler to catch any errors that we didn't expect
process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception: Message" + error.message);
  logger.error(`Uncaught Exception: Stack ${error.stack}`);
  process.exit(1);
});

// This is a backup error handler to catch any promises that failed that we didn't expec

process.on("unhandledRejection", (error: Error) => {
  logger.error("Uncaught Promise" + error);
  logger.error(`Uncaught Promise: Stack ${error.stack}`);
  process.exit(1);
});

module.exports = errorHandler;
