import { Application, Request, Response, NextFunction } from "express"; // Common Web application development for NodeJS

declare global {
  namespace Express {
    interface Request {
      user: any;
      loggedInUser: any;
      oidc: any;
    }
  }
}
