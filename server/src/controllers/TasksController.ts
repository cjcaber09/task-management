import type { Request, Response } from "express";
import type {
  CreateTaskInput,
  TaskResponse,
  taskType,
} from "../types/tasks.types";
import { getAllTasks, createTask, getTaskByGuid } from "../models/tasks.model";
import { getProjectByGuid } from "../models/projects.model";
// import { ProjectResponse, ProjectType } from "../types/shared.types";

const get = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const company_guid = req.user.company_guid;
  try {
    const tasks = await getAllTasks("", ["members", "project"], company_guid);
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

const post = async (
  req: Request<{}, {}, CreateTaskInput>,
  res: Response<TaskResponse>,
): Promise<void> => {
  const { name, description, status, project_guid, priority } = req.body;
  const owner_guid = req.user?.guid;

  //   create task logic here
  // check if the project exists and is active, if not return an error
  try {
    const project = await getProjectByGuid({
      guid: project_guid,
      expand: ["members"],
    });
    if (!project) {
      res
        .status(400)
        .json({ error: "Invalid project GUID or project is not active" });
      return;
    }
    if (
      !("members" in project) ||
      !project.members ||
      project.members.length === 0
    ) {
      res.status(403).json({ error: "User is not a member of the project" });
      return;
    }
    // check if the user is a member of the project, if not return an error
    const isMember = project.members.some(
      (member) => member.user_guid === owner_guid,
    );
    if (!isMember) {
      res.status(403).json({ error: "User is not a member of the project" });
      return;
    }
    // if the user is a member of the project,
    // create the task in the database and return the created task in the response
    const newTask = await createTask({
      name,
      description,
      status,
      project_guid,
      priority: priority ? priority : "medium", // default priority
      company_guid: project.company_guid,
    });
    // create the task in the database and return the created task in the response
    res.json(newTask);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Invalid project GUID or project is not active" });
    return;
  }
};

export const updateTaskStatus = async (
  req: Request<
    Pick<taskType, "guid">,
    {},
    { status: Pick<taskType, "status"> }
  >,
  res: Response<TaskResponse>,
): Promise<void> => {
  const { guid } = req.params;
  const { status } = req.body;
  const owner_guid = req.user?.guid;

  //   update task status logic here
  // check if the task exists and is active, if not return an error
  try {
    // get the task by guid and check if it exists and is active
    const task = await getTaskByGuid(guid);
    if (!task) {
      res
        .status(400)
        .json({ error: "Invalid task GUID or task is not active" });
      return;
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid task GUID or task is not active" });
    return;
  }
};

export const getTasksByProject = async (
  req: Request<{ project_guid: string }, {}, {}>,
  res: Response<{ tasks: TaskResponse[] } | { error: string }>,
): Promise<void> => {
  const { project_guid } = req.params as { project_guid: string };
  const owner_guid = req.user?.guid;
  if (!project_guid) {
    res.status(400).json({ error: "Project GUID is required" });
    return;
  }
  //   get tasks by project logic here
  // check if the project exists and is active, if not return an error
  try {
    const project = await getProjectByGuid({
      guid: project_guid,
      expand: ["members"],
    });
    if (!project) {
      res
        .status(400)
        .json({ error: "Invalid project GUID or project is not active" });
      return;
    }
    if (!project.members?.length) {
      res.status(403).json({ error: "User is not a member of the project" });
      return;
    }
    // check if the user is a member of the project, if not return an error
    const isMember = project.members.some(
      (member) => member.user_guid === owner_guid,
    );
    if (!isMember) {
      res.status(403).json({ error: "User is not a member of the project" });
      return;
    }
    // get all tasks logic here
    const tasks = await getAllTasks(project_guid, [], project.company_guid);
    res.json({ tasks });
    return;
  } catch (error) {
    console.error("Error fetching tasks by project:", error);
    res
      .status(400)
      .json({ error: "Invalid project GUID or project is not active" });
    return;
  }
};
export default {
  get,
  post,
  getTasksByProject,
};
