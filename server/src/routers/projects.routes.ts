import express from "express";
import ProjectsController from "../controllers/ProjectsController";
import { Route } from "../types/general.types";
import { authenticateToken } from "../middleware/auth.middleware"; // Replace with your actual authentication middleware
import buildRoutes from "./routeBuilder";
const router = express.Router();

const routes: Route[] = [
  {
    method: "get",
    path: "/",
    authentication: true, // Assuming you want to protect this route
    authHandler: authenticateToken, // Replace with your actual authentication handler
    handler: ProjectsController.get,
  },
  {
    method: "post",
    path: "/",
    authentication: true, // Assuming you want to protect this route
    authHandler: authenticateToken, // Replace with your actual authentication handler
    handler: ProjectsController.post,
  },
];

buildRoutes(router, routes);

export default router;
