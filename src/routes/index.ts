// requirements for the entire app
"use strict";
import path from "path"; // module to read paths on the server

process.env["NODE_CONFIG_DIR"] = path.join(ABSOLUTE_PATH, "config");
const config = require("config");
import { logger } from "../util/logger";
const errorHandler = require("../util/errorHandler"); // load error routines
import express, { Application, Request, Response, NextFunction } from "express"; // Common Web application development for NodeJS

// Requirements for this script
const router = express.Router();
const { check, validationResult } = require("express-validator"); // used to validate inputs to routes
const { requiresAuth } = require("express-openid-connect");
import { helloworldController } from "../controllers/helloworld"; // module to read paths on the server

// Login and Login routes and pages are provided by authentication package
// added routes are /login, /callback, /logout

// GET home page.
router.get("/", function (req, res, next) {
  logger.info("Route: Root");
  helloworldController(req, res);
});

module.exports = router;
