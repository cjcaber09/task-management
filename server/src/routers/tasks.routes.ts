import type { Route } from "../types/general.types";
import express from "express";
import TasksController from "../controllers/TasksController";
import { authenticateToken } from "../middleware/auth.middleware"; // Replace with your actual authentication middleware
import buildRoutes from "./routeBuilder";
const router = express.Router();

const routes: Route[] = [
  {
    method: "post",
    path: "/",
    authentication: true, // Assuming you want to protect this route
    authHandler: authenticateToken, // Replace with your actual authentication handler
    handler: TasksController.post,
  },
  {
    method: "get",
    path: "/",
    authentication: true, // Assuming you want to protect this route
    authHandler: authenticateToken, // Replace with your actual authentication handler
    handler: TasksController.get,
  },
  {
    method: "get",
    path: "/:project_guid/lists",
    authentication: true,
    authHandler: authenticateToken,
    handler: TasksController.getTasksByProject,
  },
];

buildRoutes(router, routes);

export default router;
