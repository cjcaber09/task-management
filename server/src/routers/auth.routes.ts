import {
  forgotPassword,
  login,
  logout,
  refreshToken,
  resetPassword,
} from "../controllers/AuthController";
import express from "express";

import { Route } from "../types/general.types";
import buildRoutes from "./routeBuilder";
const authRoutes: Route[] = [
  {
    method: "post",
    path: "/login",
    handler: login,
  },
  {
    method: "post",
    path: "/logout",
    handler: logout,
  },
  {
    method: "post",
    path: "/refresh-token",
    handler: refreshToken,
  },
  {
    method: "post",
    path: "/forgot-password",
    handler: forgotPassword,
  },
  {
    method: "post",
    path: "/reset-password",
    handler: resetPassword,
  },
];

const router = express.Router();

buildRoutes(router, authRoutes);

export default router;
