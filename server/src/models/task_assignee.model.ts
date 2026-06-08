import pool from "../db/config/index";

export const assignTaskToUser = async (
  task_guid: string,
  user_guid: string,
): Promise<void> => {
  try {
    await pool.query(
      "INSERT INTO task_assignees (task_guid, user_guid) VALUES ($1, $2)",
      [task_guid, user_guid],
    );
  } catch (error) {
    console.error("Error assigning task to user: ", error);
    throw new Error("Failed to assign task to user");
  }
};
