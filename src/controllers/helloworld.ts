// requirements for the entire app
"use strict";
import path from "path"; // module to read paths on the server

process.env["NODE_CONFIG_DIR"] = path.join(ABSOLUTE_PATH, "config");
import config from "config";
import { Logger as logger } from "winston"; // Logger being used
const errorHandler = require("../util/errorHandler"); // load error routines

// Requirements for this script
import express, { Application, Request, Response, NextFunction } from "express"; // Common Web application development for NodeJS

export function helloworldController(req: Request, res: Response) {
  res.render("helloworld", { title: "Hello World" });
}
