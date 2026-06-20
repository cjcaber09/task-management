import pool from "../db/config/index";
import QueryBuilder from "../db/config/queryBuilder";
import { DBconnection } from "../types/shared.types";
import { TaskResponse, taskType } from "../types/tasks.types";

export const getAllTasks = async (
  project_guid: string = "",
  expand: string[] = [],
  company_guid: string,
): Promise<TaskResponse[]> => {
  try {
    const qb = new QueryBuilder();
    const withMembers = expand.includes("members");
    const withProject = expand.includes("project");
    const withCompany = expand.includes("company");
    const hasProject = project_guid !== "";

    const selectFields = ["t.*"];
    if (withMembers) {
      selectFields.push(
        "COALESCE(JSON_AGG(pm.*) FILTER (WHERE pm.user_guid IS NOT NULL), '[]') AS members",
      );
    }
    if (withProject) {
      selectFields.push(
        withMembers
          ? "(array_agg(row_to_json(p.*)))[1] AS project"
          : "row_to_json(p.*) AS project",
      );
    }
    if (withCompany) {
      selectFields.push(
        withMembers
          ? "(array_agg(row_to_json(c.*)))[1] AS company"
          : "row_to_json(c.*) AS company",
      );
    }

    qb.select("tasks", selectFields, "t");

    if (withMembers) {
      qb.leftJoin(
        "project_members pm",
        ["pm.project_guid = t.project_guid"],
        false,
      );
    }
    if (withProject) {
      qb.leftJoin("projects p", ["p.guid = t.project_guid"], false);
    }
    if (withCompany) {
      qb.leftJoin("companies c", ["c.guid = t.company_guid"], false);
    }

    qb.where("t.deleted_at IS NULL", null).andWhere(
      "t.status != 'archived'",
      null,
    );

    if (hasProject) {
      qb.andWhere("t.project_guid = $1", project_guid);
    }

    if (withMembers) {
      qb.groupBy("t.guid");
    }

    const { query, params } = qb.build();
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
};

export const createTask = async (taskData: any): Promise<TaskResponse> => {
  try {
    const result = await pool.query(
      "INSERT INTO tasks (project_guid, name, description, status, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        taskData.project_guid,
        taskData.name,
        taskData.description,
        taskData.status,
        taskData.priority,
      ],
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating task: ", error);
    throw new Error("Failed to create task");
  }
};

export const getTaskByGuid = async (
  guid: taskType["guid"],
  client: DBconnection | null = null,
): Promise<TaskResponse> => {
  try {
    let connection: DBconnection = client ? client : pool;
    const result = await connection.query(
      "SELECT * FROM tasks WHERE guid = $1 AND deleted_at IS NULL",
      [guid],
    );
    if (result.rows.length === 0) {
      throw new Error("Task not found");
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching task: ", error);
    throw new Error("Failed to fetch task");
  }
};

export const updateTaskInfo = async (
  { guid }: Pick<taskType, "guid">,
  { updateData }: { updateData: Partial<Omit<taskType, "guid">> },
): Promise<TaskResponse> => {
  try {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ");
    const result = await pool.query(
      `UPDATE tasks SET ${setClause}, updated_at = NOW() WHERE guid = $${fields.length + 1} AND deleted_at IS NULL`,
      [...values, guid],
    );
    if (result.rowCount === 0) {
      throw new Error("Task not found or no changes made");
    }
    const updatedTask = await getTaskByGuid(guid);
    return updatedTask;
  } catch (error) {
    console.error("Error updating task: ", error);
    throw new Error("Failed to update task");
  }
};
