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
    let result;
    if (expand.includes("members")) {
      qb.select("tasks", ["t.*", "JSON_AGG(members.*) AS members"], "t")
        .leftJoin(
          "project_members",
          ["project_members.project_guid = t.project_guid"],
          false,
        )
        .where("t.project_guid = $1", project_guid)
        .andWhere("t.deleted_at IS NULL", null)
        .groupBy("t.guid");
      const { query, params } = qb.build();
      result = await pool.query(query, [project_guid]);
    }
    if (project_guid === "") {
      const qb = new QueryBuilder();
      qb.select("tasks", ["t.*"], "t").where("t.deleted_at IS NULL", null);
      const { query, params } = qb.build();
      result = await pool.query(query);
    } else {
      const qb = new QueryBuilder();
      qb.select("tasks", ["t.*"], "t")
        .where("t.project_guid = $1", project_guid)
        .andWhere("t.deleted_at IS NULL", null);
      const { query, params } = qb.build();
      result = await pool.query(query, [project_guid]);
    }
    return result.rows;
  } catch (error) {
    console.error("Error fetching tasks: ", error);
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
