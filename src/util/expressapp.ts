// Common Modules used in all modules
"use strict";
const path = require("path"); // module to read paths on the server

process.env["NODE_CONFIG_DIR"] = path.join(ABSOLUTE_PATH, "config");
const config = require("config");
const logger = require("winston"); // Logger being used
import { errorHandler } from "../util/errorHandler"; // load error routines

// Requirements for this script
import express, { Application, Request, Response, NextFunction } from "express"; // Common Web application development for NodeJS

const { addAuthentication } = require("./authentication");

/*
Create Express App
Create the application as an express application
Things to remember:
    var app=express();  <--defines the app
    app.set(setting, value) <-- configuration settings
    app.use([route], middleware function) <-- add middleware. these are functions that will run all the time a particular route is run. When route is not specified it always runs. must call the done() function at the the end so it goes to the next middleware
    app.get([route], function) <--- these functions will run only where there is an HTTP GET to the route specified. This is useful for rendering a page at a specific route like /index
    app.post([route], function) <--- these functions will run only where there is an HTTP POST to the route specified. This is useful for recieving information from a post from a form like /login
    app.use([route], router function) <-- all the same as middleware, this is a common convention to add all the the GETs, POSTs, in one place called a router and add them all at once to the app
    app.listen(PORT, callback) <--- starts the app to listen on a port and then execution the function 
*/

// Create an instance of an express app
const app: Application = express();

// configure express to automatically parse body of requests (req) into json object that is under req, like req.body.name
// this is a built in express function that replaced body-parser middleware
app.use(express.json());

// Accept url-encoded information and add to req object for example host.com?key=value
// Info on extended true vs. false:  https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

// Layout middle ware (from express-ejs-layouts)
// this will cause res.render(file) to call layout.ejs first and and render "file" into the layout.ejs file at body
const expressLayouts = require("express-ejs-layouts"); // make ejs more repeatable with a repeatable header and footer
app.use(expressLayouts);

// make certain paths that are not in views accessible by client browser
app.use(express.static(path.join(ABSOLUTE_PATH, "public")));

// setup sessions using memory store
const session = require("express-session"); // needed to store sessions and related cookies
const MemoryStore = require("memorystore")(session); // a production stable session store in memory, in particular will expire old sessions
const crypto = require("crypto");
app.use(
  session({
    name: "sessionId",
    cookie: { secure: true, httpOnly: true, maxAge: 86400000 },
    saveUninitialized: false,
    store: new MemoryStore({ checkPeriod: 86400000 }), // prune expired entries every 24h
    resave: false,
    secret: crypto.randomBytes(8).toString("hex"), // this create a random secret. note this is more secure, but it means sessions won't persist among clustered servers
  })
);

// setup authentication
// Configure authentication
if (!config.auth?.defaultProvider) {
  errorHandler(new Error("No authentication provider specified"));
} else {
  const oidcProvider = config.auth.defaultProvider;
  const oidcConfig = config.auth[oidcProvider];
  addAuthentication(app, oidcConfig);
}

// Middleware - Log all http requests
app.use((req: any, res: Response, next: NextFunction) => {
  logger.info(`${req.loggedInUser} user [${req.originalUrl}]`);
  next();
});

// Setup the router by getting all the routes and adding to the middleware
const indexRouter = require(path.join(ABSOLUTE_PATH, "routes/index"));
app.use("/", indexRouter);

// If you got this far, means you've called a route we don't have
// Mark  as a 404 and forward to error handler
// ideas from: https://github.com/expressjs/express/blob/master/examples/error-pages/index.js
app.use((req: any, res: Response, next: NextFunction): void => {
  res.status(404);

  // respond with html page
  if (req.accepts("html")) {
    res.render("errors/404", { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts("json")) {
    res.json({ error: "Not found" });
    return;
  }

  // default to plain-text. send()
  res.type("txt").send("Not found");

  next();
});

// Setup error handler by specifying it as the last middle ware
app.use(errorHandler);

//return app;
module.exports = app;
