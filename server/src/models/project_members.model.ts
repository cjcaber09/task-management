import pool from "../db/config/index";

export const getProjectMembers = async (
  projectGuid: string,
): Promise<any[]> => {
  try {
    const result = await pool.query(
      `SELECT u.guid, u.name, u.email, pm.role 
       FROM users u
       JOIN project_members pm ON pm.user_guid = u.guid
       JOIN projects p ON pm.project_guid = p.guid
       WHERE p.guid = $1 AND u.deleted_at IS NULL`,
      [projectGuid],
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching project members: ", error);
    throw new Error("Failed to fetch project members");
  }
};

export const createMemberToProject = async (
  project_guid: string,
  user_guid: string,
  role: string = "member",
  client: any = null,
): Promise<void> => {
  try {
    let connection = null;
    if (client) {
      connection = client;
    } else {
      connection = pool;
    }
    const result = await connection.query(
      "INSERT INTO project_members (project_guid, user_guid, role) VALUES ($1, $2, $3)",
      [project_guid, user_guid, role],
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error adding member to project: ", error);
    throw new Error("Failed to add member to project");
  }
};
