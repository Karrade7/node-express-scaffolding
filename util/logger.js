// requirements for the entire app
'use strict';
const config = require('config');
const logger = require('winston'); // Logger being used
const path = require('path'); // module to read paths on the server
const errorHandler = require(path.join(ABSOLUTE_PATH, 'util/errorHandler.js')); // load error routines


// Requirements for this script



// Configure the console logger. this is primarily used for debugging
const winstonConsole = new logger.transports.Console({
    level: 'info',
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
        trace: 5,
    },
    format: logger.format.combine(
        logger.format.colorize(),
        logger.format.timestamp(),
        logger.format.align(),
        logger.format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        logger.format.printf(info => `${[info.timestamp]}: [${info.level}] ${info.message}`),
    )
});

logger.add(winstonConsole);