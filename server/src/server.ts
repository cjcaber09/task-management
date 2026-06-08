import express from "express";
import userRoutes from "./routers/users.routes";
import authRoutes from "./routers/auth.routes";
import projectRoutes from "./routers/projects.routes";
import taskRoutes from "./routers/tasks.routes";
import commentRoutes from "./routers/comments.routes";
import cors from "cors";
const app = express();
import dotenv from "dotenv";

dotenv.config();

app.use(express.json());
app.use(cors());

const prefix = "/api/v1";
const urls = [
  {
    name: "Users",
    url: `${prefix}/users`,
    handler: userRoutes,
  },
  {
    name: "Auth",
    url: `${prefix}/auth`,
    handler: authRoutes,
  },
  {
    name: "Projects",
    url: `${prefix}/projects`,
    handler: projectRoutes,
  },
  {
    name: "Tasks",
    url: `${prefix}/tasks`,
    handler: taskRoutes,
  },
  {
    name: "Comments",
    url: `${prefix}/comments`,
    handler: commentRoutes,
  },
];
urls.forEach((route) => {
  app.use(route.url, route.handler);
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
