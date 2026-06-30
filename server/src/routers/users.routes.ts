import express from "express";
import UsersController from "../controllers/UsersController";
import { Route } from "../types/general.types";
import buildRoutes from "./routeBuilder";
import {
  validateCreateUser,
  validateUpdatePassword,
} from "../middleware/validations/index";
import { authenticateToken } from "../middleware/auth.middleware"; // Replace with your actual authentication middleware
import multer from "multer"; // Import multer for file uploads
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
  {
    method: "get",
    path: "/search",
    authentication: true, // Assuming you want to protect this route
    authHandler: authenticateToken, // Replace with your actual authentication handler
    handler: UsersController.searchUsers,
  },
  {
    method: "get",
    path: "/find",
    authentication: true, // Assuming you want to protect this route
    authHandler: authenticateToken, // Replace with your actual authentication handler
    handler: UsersController.findUserByEmail,
  },
  {
    method: "post",
    path: "/:guid/update-password",
    authentication: true, // Assuming you want to protect this route
    authHandler: authenticateToken, // Replace with your actual authentication handler
    handler: UsersController.updatePassword,
    validation: true, // Assuming you want to validate this route
    validationHandler: validateUpdatePassword, // Replace with your actual validation handler
  },
  {
    method: "post",
    path: "/:guid/update-user-data",
    authentication: true, // Assuming you want to protect this route
    authHandler: authenticateToken, // Replace with your actual authentication handler
    handler: UsersController.updateUserData,
    middleware: [
      multer({ storage: multer.memoryStorage() }).single("profilePicture"), // Assuming you're using multer for file uploads
    ],
  },
];

buildRoutes(router, routes);

export default router;
