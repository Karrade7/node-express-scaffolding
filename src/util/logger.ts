// requirements for the entire app
"use strict";
const path = require("path"); // module to read paths on the server
//const ABSOLUTE_PATH = path.resolve(__dirname); // set a consistent path for cleaner require commands

process.env["NODE_CONFIG_DIR"] = path.join(ABSOLUTE_PATH, "config");
const config = require("config");
import winston, { createLogger, transports, format } from "winston"; // Logger being used
const errorHandler = require("./errorHandler"); // load error routines

// Requirements for this script
import { DateFromISOString } from "io-ts-types/lib/DateFromISOString";

export const logger = createLogger({
  transports: [new transports.Console()],
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  },
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
});

winston.add(logger);
