import type { Request, Response } from "express";
import {
  createProject,
  getAllProjects,
  archiveProjectByGuid,
} from "../models/projects.model";
import { CreateProjectInput, ProjectResponse } from "../types/shared.types";
import { companyCheck } from "../models/company.model"; // Assuming this function checks if the company exists and is active
import { fetchUserByGuidOrEmail, userCheck } from "../models/users.model"; // Assuming this function checks if the user exists and is active
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
  // check if members has email or guid and validate them before creating the project, we can add more complex validation logic here if needed (e.g., if the member is identified by email, we need to fetch their guid first before adding them as a member)
  if (req.body.members && req.body.members.length > 0) {
    for (const member of req.body.members) {
      if (member.user_guid) {
        const memberExists = await fetchUserByGuidOrEmail({
          guid: member.user_guid,
        }); // Assuming userCheck is a function that checks if the user exists and is active
        if (!memberExists) {
          res.status(400).json({
            error: `Member with guid ${member.user_guid} not found or is inactive`,
          });
          return;
        }
      } else if (member.email) {
        const memberExists = await fetchUserByGuidOrEmail({
          email: member.email,
        }); // Assuming userCheck can also check by email
        // push the guid of the member to the members array in the request body so we can use it later when creating the project, we can also add more complex logic here if needed (e.g., if the member is identified by email, we need to fetch their guid first before adding them as a member)
        if (memberExists) {
          member.user_guid = memberExists.guid;
        }
        if (!memberExists) {
          res.status(400).json({
            error: `Member with email ${member.email} not found or is inactive`,
          });
          return;
        }
      } else {
        res.status(400).json({
          error: "Each member must have either a user_guid or an email",
        });
        return;
      }
    }
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
  try {
    archivedProject = await archiveProjectByGuid({ guid }); // Assuming archiveProjectByGuid is a function that archives a project by its GUID and returns the archived project details
    res.json({
      message: "Project archived successfully",
      project: archivedProject,
    });
  } catch (error) {
    console.error("Error archiving project: ", error);
    res.status(500).json({ error: "Failed to archive project" });
    return;
  }
};
export default {
  get,
  post,
  archiveProject,
};
