import pool from "../db/config/index";
export const createComment = async ({
  comment,
  task_guid,
  status = "active",
  user_guid,
}: {
  comment: string;
  task_guid: string;
  status?: string;
  user_guid: string;
}) => {
  try {
    // return the created comment with user information
    const result = await pool.query(
      "INSERT INTO task_comments (comment, task_guid, status, user_guid) VALUES ($1, $2, $3, $4) RETURNING *",
      [comment, task_guid, status, user_guid],
    );
    const userResult = await pool.query(
      "SELECT row_to_json(u.*) AS user FROM users u WHERE u.guid = $1",
      [user_guid],
    );
    return { ...result.rows[0], user: userResult.rows[0].user };
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const getCommentsByTask = async (
  task_guid: string,
  expand: string[] = [],
) => {
  try {
    const withUser = expand.includes("user");
    const result = await pool.query(
      `SELECT tc.* ${withUser ? ", row_to_json(u.*) AS user" : ""} 
       FROM task_comments tc 
       ${withUser ? "JOIN users u ON tc.user_guid = u.guid" : ""} 
       WHERE tc.task_guid = $1 AND tc.deleted_at IS NULL 
       ORDER BY tc.created_at DESC`,
      [task_guid],
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};
