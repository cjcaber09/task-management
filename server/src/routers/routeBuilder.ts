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
    const handlers: express.RequestHandler[] = [];

    if (route.authentication && route.authHandler) {
      handlers.push(route.authHandler);
    }

    if (route.validation && route.validationHandler) {
      handlers.push(route.validationHandler);
    }

    if (route.middleware && route.middleware.length > 0) {
      handlers.push(...route.middleware);
    }

    handlers.push(route.handler);

    router[route.method](route.path, ...handlers);
  });
};

export default buildRoutes;
