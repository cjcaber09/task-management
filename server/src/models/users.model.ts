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
  console.log("Registering user with email: ", email);
  debugger;
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
      const newCompany = await createCompany(companyInfo.name, client);
      let company_guid = newCompany.guid;
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
