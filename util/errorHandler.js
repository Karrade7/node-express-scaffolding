// requirements for the entire app
'use strict';
const config = require('config');
const logger = require('winston'); // Logger being used
const path = require('path'); // module to read paths on the server
const { errorMonitor } = require('events');

// Requirements for this script


function errorHandler (error, res, next) {
    if (!error){
        res.status(500)
        error.message = "Unknown Error";
        error.stack = "Unknown Stack";
    }
    if (!(error instanceof Error)){
        error = new Error(error);
        error.stack = "Unknown Stack"
        //error = err;
    }
    logger.error(`Error Logged:" ${error.message}`)
    if(res.headersSent) {
        res.write("Error\n")
        res.write(error.message);
        res.write(error.stack);
        res.end();
        logger.error("Exiting");
        process.exit(1);
    }
    res.render('errors/500', { error: error })
    logger.error("Exiting");
    process.exit(1);
}
  
// This is a backup error handler to catch any errors that we didn't expect
process.on('uncaughtException', error => {
    logger.error("Uncaught Exception: Message" + error.message);
    logger.error("Uncaught Exception: Stack" + error.stack);
    process.exit(1);
})

// This is a backup error handler to catch any promises that failed that we didn't expec

process.on('unhandledRejection', error => {
    logger.error("Uncaught Promise" + error);
    logger.error("Uncaught Promise: Stack" + error.stack);
    process.exit(1);
})


module.exports = errorHandler;