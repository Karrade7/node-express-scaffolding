// requirements for the entire app
"use strict";
const path = require("path"); // module to read paths on the server

process.env["NODE_CONFIG_DIR"] = path.join(ABSOLUTE_PATH, "config");
const config = require("config");
const logger = require("winston"); // Logger being used
const errorHandler = require("./errorHandler"); // load error routines

// Requirements for this script
const { auth } = require("express-openid-connect");
import { Request, Response, NextFunction } from "express";

var addAuthentication = function (app: any, config: any) {
  // auth router attaches /login, /logout, and /callback routes to the baseURL
  if (config?.auth?.enabled === undefined || config?.auth?.enabled === false) {
    return;
  }
  app.use(auth(config));

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.loggedInUser = req.oidc.user ? req.oidc.user : "Anonymous";
    next();
  });

  // Setup User information for navbar and logging
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.loggedInUser = req.user ? req.user : "Anonymous";
    next();
  });
};

module.exports = {
  addAuthentication: addAuthentication,
};
