/**
 * Register a new user
 */

import pool from "../db/config/index";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type {
  ErrorResponse,
  RegisterResponse,
  UserType,
} from "../types/users.type";
import { createCompany } from "./company.model";
import type { RegisterUserInput, LoginUserInput } from "../types/shared.types";
/**
 * Register a new user with the given email and password.
 * @param email The email of the new user.
 * @param password The password of the new user.
 * @param userInfo Additional user information (optional).
 * @returns The newly registered user.
 * @throws An error if the email already exists or if there is a database error.
 */
export const registerUser = async ({
  email,
  password,
  userInfo,
  companyInfo,
}: Omit<RegisterUserInput, "confirmPassword">): Promise<RegisterResponse> => {
  // Registration logic here
  const user = await pool.query("select * from users where email = $1", [
    email,
  ]);
  if (user.rows.length > 0) {
    throw new Error("Email already exists");
  }
  // encrypt the password using bcrypt
  password = await bcrypt.hash(password, 10);

  let newUser;
  // if companyInfo is provided, create a new company and add the user to the company use transaction to ensure that both operations are atomic
  if (companyInfo) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      let company;

      if (companyInfo.guid) {
        // use the provided company_guid if it exists, otherwise create a new company and use its guid
        // find the company by the provided company_guid, if it does not exist, throw an error
        company = await client.query(
          "SELECT guid FROM company WHERE guid = $1 AND deleted_at IS NULL",
          [companyInfo.guid],
        );
        if (company.rows.length === 0) {
          throw new Error("Company with the provided guid does not exist");
        }
      } else {
        company = await createCompany(companyInfo.name, client);
      }
      console.log("Company guid to be used for the new user: ", company);
      let company_guid = company.rows[0].company_guid || company.rows[0].guid; // Depending on whether we created a new company or used an existing one, the guid might be in different places
      newUser = await client.query(
        "insert into users (email, password, name, company_guid) values ($1, $2, $3, $4) returning *",
        [email, password, userInfo.name, company_guid],
      );
      await client.query(
        "insert into company_members (company_guid, user_guid) values ($1, $2)",
        [company_guid, newUser.rows[0].guid],
      );
      await client.query("COMMIT");
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw new Error(
        "Error creating company and user: " +
          (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      client.release();
    }
  } else {
    newUser = await pool.query(
      "insert into users (email, password, name) values ($1, $2, $3) returning *",
      [email, password, userInfo.name],
    );
  }
  const token = jwt.sign(
    {
      guid: newUser.rows[0].guid,
      email: newUser.rows[0].email,
      name: newUser.rows[0].name,
      company_guid: newUser.rows[0].company_guid,
    },
    process.env.JWT_SECRET || "secret",
    {
      expiresIn: "1h",
    },
  );
  // remove the password from the user object before returning it
  const { password: _, ...userWithoutPassword } = newUser.rows[0];
  //   set the token to be used for authentication in the future
  return { user: userWithoutPassword, token };
};

export const authenticateUser = async ({
  email,
  password,
}: LoginUserInput): Promise<Omit<UserType, "password">> => {
  let errors = [];
  try {
    const user = await pool.query("select * from users where email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      errors.push("Invalid email or password");
      throw new Error(errors.join(", "));
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      user.rows[0].password,
    );
    if (!isPasswordValid) {
      errors.push("Invalid email or password");
      throw new Error(errors.join(", "));
    }

    const { password: _, ...userWithoutPassword } = user.rows[0];
    return userWithoutPassword;
  } catch (error: ErrorResponse | any) {
    throw new Error(error);
  }
};

export const userCheck = async (user_guid: string): Promise<Boolean> => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE guid = $1 AND deleted_at IS NULL LIMIT 1",
      [user_guid],
    );
    if (result.rows.length === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error checking user: ", error);
    throw new Error("Failed to check user");
  }
};
export const fetchUserByGuidOrEmail = async ({
  guid,
  email,
}: {
  guid?: string;
  email?: string;
}): Promise<Omit<UserType, "password"> | null> => {
  try {
    let query = "SELECT * FROM users WHERE deleted_at IS NULL AND ";
    let params: any[] = [];
    if (guid) {
      query += "guid = $1";
      params.push(guid);
    } else if (email) {
      query += "email = $1";
      params.push(email);
    } else {
      throw new Error("Either guid or email must be provided");
    }
    const result = await pool.query(query, params);
    if (result.rows.length === 0) {
      return null;
    }
    const { password: _, ...userWithoutPassword } = result.rows[0];
    return userWithoutPassword;
  } catch (error) {
    console.error("Error fetching user: ", error);
    throw new Error("Failed to fetch user");
  }
};
export const archiveUser = async (user_guid: string): Promise<void> => {
  try {
    await pool.query("UPDATE users SET deleted_at = NOW() WHERE guid = $1", [
      user_guid,
    ]);
  } catch (error) {
    console.error("Error archiving user: ", error);
    throw new Error("Failed to archive user");
  }
};

export const searchUsersByEmail = async ({
  email,
  company_guid,
  exact = false,
}: Pick<UserType, "email" | "company_guid"> & { exact?: boolean }): Promise<
  Omit<UserType, "password">[]
> => {
  // email is already normalized in the controller, so we can directly use it here
  try {
    const query = exact
      ? "SELECT guid, email, name, company_guid, created_at, updated_at, deleted_at FROM users WHERE lower(email) = $1 AND company_guid=$2 AND deleted_at IS NULL"
      : "SELECT guid, email, name, company_guid, created_at, updated_at, deleted_at FROM users WHERE email ILIKE $1 AND company_guid=$2 AND deleted_at IS NULL";
    const result = await pool.query(query, [
      exact ? email : `%${email}%`,
      company_guid,
    ]);
    return result.rows;
  } catch (error) {
    console.error("Error searching users: ", error);
    throw new Error("Failed to search users");
  }
};
