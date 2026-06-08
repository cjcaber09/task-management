import express from "express";

export interface Route {
  method: "get" | "post" | "put" | "delete";
  path: string;
  authentication?: boolean;
  authHandler?: express.RequestHandler<any, any, any, any>;
  validation?: boolean;
  validationHandler?: express.RequestHandler<any, any, any, any>;
  handler: express.RequestHandler<any, any, any, any>;
}
