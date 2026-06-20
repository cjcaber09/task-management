import express from "express";
import ProjectsController from "../controllers/ProjectsController";
import { Route } from "../types/general.types";
import { authenticateToken } from "../middleware/auth.middleware"; // Replace with your actual authentication middleware
import buildRoutes from "./routeBuilder";
import { validateAddMembers } from "../middleware/validations";
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
  {
    method: "delete",
    path: "/:guid",
    authentication: true, // Assuming you want to protect this route
    authHandler: authenticateToken, // Replace with your actual authentication handler
    handler: ProjectsController.archiveProject, // Assuming you want to archive the project instead of deleting it permanently
  },
  {
    method: "post",
    path: "/:guid/members",
    authentication: true, // Assuming you want to protect this route
    authHandler: authenticateToken, // Replace with your actual authentication handler
    validation: true, // Assuming you want to validate this route
    validationHandler: validateAddMembers, // New validation handler for adding members
    handler: ProjectsController.addMembersToProject, // New route for adding members to a project
  },
];

buildRoutes(router, routes);

export default router;
