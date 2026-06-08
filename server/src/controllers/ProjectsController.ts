import type { Request, Response } from "express";
import { createProject, getAllProjects } from "../models/projects.model";
import { CreateProjectInput, ProjectResponse } from "../types/shared.types";
import { companyCheck } from "../models/company.model"; // Assuming this function checks if the company exists and is active
import { userCheck } from "../models/users.model"; // Assuming this function checks if the user exists and is active
const get = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    if (projectId) {
      // get project by id logic here
    } else {
      const guid = req.user?.guid; // Assuming req.user is populated by authentication middleware
      if (!guid) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      // get all projects logic here
      const projects = await getAllProjects(guid); // Assuming getAllProjects is a function that fetches all projects
      res.json({ projects });
    }
  } catch (error) {
    console.error("Error fetching projects: ", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

const post = async (
  req: Request<{}, {}, CreateProjectInput>,
  res: Response<ProjectResponse>,
): Promise<void> => {
  const { name, description, status, company_guid } = req.body;
  const owner_guid = req.user?.guid; // Assuming req.user is populated by authentication middleware
  if (!owner_guid) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  //   Validate owner_guid and company_guid logic here (e.g., check if they exist and are active) before creating the project
  const companyExists = await companyCheck(company_guid); // Assuming companyCheck is a function that checks if the company exists and is active
  if (!companyExists) {
    res.status(400).json({ error: "Company not found or is inactive" });
    return;
  }
  const ownerExists = await userCheck(owner_guid); // Assuming userCheck is a function that checks if the user exists and is active
  if (!ownerExists) {
    res.status(400).json({ error: "Owner not found or is inactive" });
    return;
  }
  // create project logic here
  const project = await createProject({
    owner_guid,
    name,
    description,
    status,
    company_guid,
    members: req.body.members || [], // Optional members field
  }); // Assuming createProject is a function that creates a new project
  if (project) {
    res.status(201).json(project);
  } else {
    res.status(400).json({ error: "Failed to create project" });
  }
};

const archiveProject = async (
  req: Request<{ guid: string }, {}, {}>,
  res: Response,
) => {
  const { guid } = req.params;
  // archive project logic here
  let archivedProject;
  // const archivedProject = await archiveProject(guid); // Assuming archiveProject is a function that archives a project by its GUID
  res.json({
    message: "Project archived successfully",
    project: archivedProject,
  });
};
export default {
  get,
  post,
  archiveProject,
};
