import type { PoolClient } from "pg";
import pool from "../db/config/index";
type DBConnection = PoolClient | typeof pool;
export const companyCheck = async (company_guid: string): Promise<Boolean> => {
  try {
    const result = await pool.query(
      "SELECT * FROM company WHERE guid = $1 AND deleted_at IS NULL LIMIT 1",
      [company_guid],
    );
    if (result.rows.length === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error checking company: ", error);
    throw new Error("Failed to check company");
  }
};

export const createCompany = async (
  name: string,
  client: PoolClient | null = null,
): Promise<any> => {
  try {
    let connection: DBConnection = client ? client : pool;
    const result = await connection.query(
      "INSERT INTO company (name) VALUES ($1) RETURNING *",
      [name],
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create company");
  }
};

export const getCompanyByUserGuid = async (user_guid: string): Promise<any> => {
  try {
    const result = await pool.query(
      `SELECT c.* FROM company c
       JOIN company_members cm ON c.guid = cm.company_guid
       WHERE cm.user_guid = $1 AND c.deleted_at IS NULL LIMIT 1`,
      [user_guid],
    );
    if (result.rows.length === 0) {
      return null; // No company found for the user
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching company by user GUID: ", error);
    throw new Error("Failed to fetch company");
  }
};
