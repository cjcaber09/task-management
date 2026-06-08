import express from "express";
import { Route } from "../types/general.types";

/**
 * This function takes an Express router and an array of routes, and registers the routes on the router.
 * It also handles authentication and validation if specified in the route definition.
 * @param router - The Express router to register the routes on.
 * @param routes - An array of route definitions to register.
 */

const buildRoutes = (router: express.Router, routes: Route[]) => {
  routes.forEach((route) => {
    if (route.authentication && route.authHandler) {
      router[route.method](route.path, route.authHandler, route.handler);
    } else if (route.validation && route.validationHandler) {
      router[route.method](route.path, route.validationHandler, route.handler);
    } else {
      router[route.method](route.path, route.handler);
    }
  });
};

export default buildRoutes;
