// Common Modules used in all modules
'use strict';
const config = require('config'); // Load config first
const logger = require('winston'); // load winston as logger
const path = require('path'); // module to read paths on the server - this is not icluded as const only on entry
const errorHandler = require(path.join(ABSOLUTE_PATH, 'util/errorHandler.js')); // load error routines


// Requirements for this script
const express = require('express'); // Common Web application development for NodeJS
const passport = require('passport'); // Commonly used authenticaton middleware for NodeJS

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

// Create an instance of an express app
var app = express();

// Middleware - Log all http requests
app.use( (req, res, done) => {
  logger.info(req.originalUrl);
  done();
});

// configure express to automatically parse body of requests (req) into json object that is under req, like req.body.name
// this is a built in express function that replaced body-parser middleware
app.use(express.json());

// Accept url-encoded information and add to req object for example host.com?key=value
app.use(express.urlencoded({ extended: false }));


// set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Layout middle ware (from express-ejs-layouts)
// this will cause res.render(file) to call layout.ejs first and and render "file" into the layout.ejs file at body
const expressLayouts = require('express-ejs-layouts'); // make ejs more repeatable with a repeatable header and footer
app.use(expressLayouts);

// make certain paths that are not in views accessible by client browser
app.use(express.static(path.join(__dirname, 'public')));

// setup authentication
// Configure authentication
require(path.join(ABSOLUTE_PATH, 'util/authentication.js'));
app.use(passport.initialize());
app.use(passport.session());

// setup sessions using memory store
const session = require("express-session"); // needed to store sessions and related cookies
const MemoryStore = require('memorystore')(session) // a production stable session store in memory, in particular will expire old sessions
const crypto = require("crypto");
app.use(session({
  name: 'sessionId',
  cookie: { secure: true, httpOnly: true, maxAge: 86400000 },
  saveUninitialized: false,
  store: new MemoryStore({checkPeriod: 86400000}), // prune expired entries every 24h
  resave: false,
  secret: crypto.randomBytes(8).toString('hex'), // this create a random secret. note this is more secure, but it means sessions won't persist among clustered servers
}))


// Setup the router by getting all the routes and adding to the middleware
const indexRouter = require(path.join(ABSOLUTE_PATH, 'routes/index'));
app.use('/', indexRouter);



// If you got this far, means you've called a route we don't have
// Mark  as a 404 and forward to error handler
// ideas from: https://github.com/expressjs/express/blob/master/examples/error-pages/index.js
app.use(function(req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('errors/404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.json({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});



// Setup error handler by specifying it as the last middle ware
app.use(errorHandler);

//return app;
module.exports = app;