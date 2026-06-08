import pool from "../db/config/index";
import QueryBuilder from "../db/config/queryBuilder";
import {
  CreateProjectInput,
  MemberType,
  ProjectResponse,
} from "../types/shared.types";
import { createMemberToProject } from "./project_members.model";
import type { ProjectType } from "../types/project.types";
export interface Project {
  guid: string;
  owner_guid: string;
  name: string;
  description: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export const getAllProjects = async (
  user_guid: string | null = null,
): Promise<Project[]> => {
  try {
    const result = await pool.query(
      `SELECT 
        projects.*,
        COUNT(DISTINCT tasks.guid) AS task_count,
        JSON_AGG(
            JSON_BUILD_OBJECT(
            'user_guid', project_members.user_guid,
            'role', project_members.role,
            'joined_at', project_members.joined_at
            )
        ) FILTER (WHERE project_members.user_guid IS NOT NULL) AS members
        FROM projects
        LEFT JOIN project_members ON project_members.project_guid = projects.guid
        LEFT JOIN tasks ON tasks.project_guid = projects.guid
        WHERE projects.deleted_at IS NULL` +
        (user_guid
          ? ` AND (projects.owner_guid = $1 OR project_members.user_guid = $1)`
          : "") +
        ` GROUP BY projects.guid`,
      user_guid ? [user_guid] : [],
    );
    // add logic to fetch members for each project and include them in the response
    return result.rows;
  } catch (error) {
    console.error("Error fetching projects: ", error);
    throw new Error("Failed to fetch projects");
  }
};

/**
 * this function creates a new project in the database. It also handles adding members to the project if the members field is provided in the input.
 * The function uses a transaction to ensure that both the project creation and member additions are atomic operations. If any part of the process fails,
 *  the transaction is rolled back to maintain data integrity.
 * @param projectData { CreateProjectInput }
 * @returns { Promise<ProjectResponse> }
 */
export const createProject = async (
  projectData: CreateProjectInput,
): Promise<ProjectResponse> => {
  const client = await pool.connect();
  // Logic to create a new project in the database
  const { owner_guid, name, description, status, company_guid } = projectData;
  try {
    await client.query("BEGIN");
    const result = await client.query(
      "INSERT INTO projects (owner_guid, name, description, status, company_guid) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [owner_guid, name, description, status, company_guid],
    );
    // include the owner as a member of the project with the role of "owner"
    projectData.members = projectData.members || [];
    // projectData.members.push({ guid: owner_guid });
    // check if the owner is already included in the members list, if not add them as a member with the role of "owner"
    const ownerAlreadyMember = projectData.members.some(
      (member: MemberType) => member.user_guid === owner_guid,
    );
    if (!ownerAlreadyMember) {
      projectData.members.push({ user_guid: owner_guid, role: "owner" });
    }
    if (projectData.members && projectData.members.length > 0) {
      const memberValues = projectData.members;
      memberValues.forEach(async (member) => {
        await createMemberToProject(
          result.rows[0].guid,
          member.user_guid,
          member.role,
          client,
        );
      });
    }
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating project: ", error);
    throw new Error("Failed to create project");
  }
};

export const updateProject = async (
  projectId: string,
  projectData: any,
): Promise<ProjectResponse> => {
  // Logic to update an existing project in the database
  return {
    guid: projectId,
    company_guid: "company_guid",
    owner_guid: "owner_guid",
    name: projectData.name,
    description: projectData.description,
    status: projectData.status,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  };
};

export const deleteProject = async (
  projectId: Pick<ProjectType, "guid">,
): Promise<void> => {
  // We only do soft delete by setting the deleted_at field to the current timestamp
  try {
    await pool.query("UPDATE projects SET deleted_at = NOW() WHERE guid = $1", [
      projectId.guid,
    ]);
  } catch (error) {
    console.error("Error deleting project: ", error);
    throw new Error("Failed to delete project");
  }
  // Logic to delete a project from the database
};

export const checkProjectExists = async ({
  guid,
}: Pick<ProjectType, "guid">): Promise<Boolean> => {
  try {
    const result = await pool.query(
      "SELECT * FROM projects WHERE guid = $1 AND deleted_at IS NULL LIMIT 1",
      [guid],
    );
    if (result.rows.length === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error checking project: ", error);
    throw new Error("Failed to check project");
  }
};

/**
 * Fetches a project by its unique identifier (guid) from the database.
 * The function checks if the project exists and is not marked as deleted (deleted_at is null).
 * If the project is found, it returns the project details; otherwise, it throws an error indicating that the project was not found.
 * @param {guid} guid - The unique identifier of the project to retrieve.
 * @returns {Promise<ProjectResponse>} - A promise that resolves to the project details.
 */
export const getProjectByGuid = async ({
  guid,
  expand = [],
}: {
  guid: ProjectType["guid"];
  expand?: string[];
}): Promise<ProjectType> => {
  try {
    const qb = new QueryBuilder();

    let query;
    if (expand.includes("members")) {
      query = qb
        .select(
          "projects",
          [
            "p.*",
            "JSON_AGG(JSON_BUILD_OBJECT('user_guid', pm.user_guid, 'name', u.name, 'email', u.email, 'role', pm.role, 'joined_at', pm.joined_at)) AS members",
          ],
          "p",
        )
        .leftJoin("project_members", ["project_guid= p.guid"])
        .leftJoin("users", ["guid = pm.user_guid"])
        .and("u.deleted_at IS NULL", null)
        .where("p.guid = $1", guid)
        .andWhere("p.deleted_at IS NULL", null)
        .groupBy("p.guid")
        .build().query;
    } else {
      // default only get the number of tasks for the project without fetching the task details, we can expand this later if needed
      query = qb
        .select("projects", ["projects.*", "COUNT(tasks.guid) AS task_count"])
        .where("guid = $1", guid)
        .andWhere("deleted_at IS NULL", null)
        .join("tasks", ["guid = project_guid"], false)
        .groupBy("projects.guid")
        .build().query;
    }

    const result = await pool.query(query, [guid]);
    if (result.rows.length === 0) {
      throw new Error("Project not found");
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching project: ", error);
    throw new Error("Failed to fetch project");
  }
};
