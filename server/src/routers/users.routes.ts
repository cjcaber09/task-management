import express from "express";
import UsersController from "../controllers/UsersController";
import { Route } from "../types/general.types";
import buildRoutes from "./routeBuilder";
import { validateCreateUser } from "../middleware/validations/index";
import { authenticateToken } from "../middleware/auth.middleware"; // Replace with your actual authentication middleware
const router = express.Router();

// Example route
const routes: Route[] = [
  {
    method: "get",
    path: "/",
    handler: UsersController.get,
  },
  {
    method: "post",
    path: "/",
    validation: true, // Assuming you want to validate this route
    validationHandler: validateCreateUser, // Replace with your actual validation handler
    handler: UsersController.post,
  },
  {
    method: "get",
    path: "/me",
    authentication: true, // Assuming you want to protect this route
    authHandler: authenticateToken, // Replace with your actual authentication handler
    handler: UsersController.getMe,
  },

  {
    method: "get",
    path: "/me/company",
    authentication: true, // Assuming you want to protect this route
    authHandler: authenticateToken, // Replace with your actual authentication handler
    handler: UsersController.getCompany,
  },
];

buildRoutes(router, routes);

export default router;
