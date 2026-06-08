import express from "express";
import { getCommentsByTaskGuid, post } from "../controllers/CommentsController";
import { Route } from "../types/general.types";
import routeBuilder from "./routeBuilder";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

const routes: Route[] = [
  {
    method: "post",
    path: "/task/:guid",
    handler: post,
    authentication: true,
    authHandler: authenticateToken, // Replace with your actual authentication handler,
  },
  {
    method: "get",
    path: "/task/:guid",
    handler: getCommentsByTaskGuid,
    authentication: true,
    authHandler: authenticateToken, // Replace with your actual authentication handler,
  },
];

routeBuilder(router, routes);

export default router;
