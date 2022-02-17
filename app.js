// Common Modules used in all modules
const config = require('config'); // Load config first
const express = require('express'); // Common Web application development for NodeJS
const logger = require('winston'); // load winston as logger


// Modules for this module
const path = require('path'); // functions to manipulate path names for example path.join('/foo', 'bar', 'baz/asdf', 'quux', '..') to get '/foo/bar/baz/asdf'
const cookieParser = require('cookie-parser');  // Cookie Parser: Middleware for express -  parsers cookie information and adds to req.cookie

/*
Create Express App
Create the application as an express application
Things to remember:
    var app=express();  <--defines the app
    app.set(setting, value) <-- configuration settings
    app.use([path], middleware function) <-- add middleware. these are functions that will run all the time a partocular path is run. When path is not specified it always runs.
    app.get([path], function) <--- these functions will run only where there is an HTTP GET to the path specified. This is usefule for rendering a page at a specific path like /index
    app.post([path], function) <--- these functions will run only where there is an HTTP POST to the path specified. This is usefule for recieving information from a post from a form like /login
    app.use([path], router function) <-- all the same as middleware, this is a common convention to add all the the GETs, POSTs, in one place called a router and add them all at once to the app
    app.listen(PORT, callback) <--- starts the app to listen on a port and then execution the function 
*/

var app = express();

// set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// make certain paths that are not in views accessible by client browser
app.use(express.static(path.join(__dirname, 'public')));

// Log all http requests
app.use( (req, res, done) => {
    logger.info(req.originalUrl);
    done();
  });

// configure express to automatically parse body of requests (req) into json object that is under req, like req.body.name
// this is built in express function that replaces body-parser middleware
app.use(express.json());


// Accept url-encoded information and add to req object
// app.use(express.urlencoded({ extended: false }));

// parse cookie information and put into req.cookies (unsigned) or req.signedcookies (signed)
app.use(cookieParser());


// Setup the router by getting all the routes and adding to the middleware
var indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Setup error handler by specifying it as the last middle ware
app.use(errorHandler);


// Start the application
const PORT = process.env.PORT || config.app.port;
app.listen(PORT, () => logger.info(`App listening on port ${PORT}!`))