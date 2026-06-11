import type { Response, Request } from "express";
import {
  registerUser,
  archiveUser,
  searchUsersByEmail,
} from "../models/users.model";
import type { RegisterResponse, ErrorResponse } from "../types/users.type";
import { getCompanyByUserGuid } from "../models/company.model"; // Assuming this function fetches the company associated with the user's GUID
const get = (req: any, res: Response) => {
  //   get user logic here
};
const post = async (
  req: any,
  res: Response<RegisterResponse | ErrorResponse>,
): Promise<void> => {
  // register user logic here
  const { email, password, companyInfo } = req.body;
  companyInfo.role = companyInfo.role || "owner"; // Default role to "owner" if not provided
  const userInfo = req.body.userInfo;
  try {
    const newUser = await registerUser({
      email,
      password,
      userInfo,
      companyInfo,
    });
    // create company and add user to company logic here
    res.json({ user: newUser.user, token: newUser.token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const deleteHandler = async (
  req: Request<{ guid: string }, {}, { option: string }>,
  res: Response,
) => {
  const { guid } = req.params;
  // delete user logic here
  const deactivatedUser = await archiveUser(guid); // Assuming deleteUser is a function that deletes a user by their GUID
  res.json({ message: "User deleted successfully", user: deactivatedUser });
};

const getMe = async (req: any, res: Response) => {
  // get current user logic here
  const user = req.user; // Assuming req.user is populated by authentication middleware
  if (user) {
    res.json({ user });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

const getCompany = async (req: any, res: Response) => {
  // get user's company logic here
  const user = req.user; // Assuming req.user is populated by authentication middleware
  if (user) {
    console.log("Fetching company for user: ", user.guid);
    const company = await getCompanyByUserGuid(user.guid); // Assuming getCompanyByUserGuid is a function that fetches the company associated with the user's GUID
    if (company) {
      res.json({ company });
    } else {
      res.status(404).json({ error: "Company not found" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

/**
 * search users logic here
 * Searches for users based on a query parameter EMAIL and returns matching users.
 * This can be used for adding members to projects or companies.
 * @param req Request object containing the query parameter 'query' which is the email to search for
 * @query The email query parameter to search for in the users database
 * @param res
 */
const searchUsers = async (
  req: Request<{}, {}, {}, { email: string }>,
  res: Response,
) => {
  // users/search?email="t"
  // search users logic here
  const { email } = req.query;
  if (!email) {
    res.status(400).json({ error: "Email query parameter is required" });
    return;
  }
  // Search for users by email logic here
  const user = req.user; // Assuming req.user is populated by authentication middleware
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const users = await searchUsersByEmail({
    email,
    company_guid: user.company_guid,
  }); // Assuming searchUsersByEmail is a function that searches for users by their email and returns matching users
  // Assuming searchUsersByEmail is a function that searches for users by their email and returns matching users
  res.json({ users });
};

const findUserByEmail = async (
  req: Request<{}, {}, {}, { email: string }>,
  res: Response,
) => {
  const { email } = req.query;
  const normalized = email.trim().toLowerCase();
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  console.log("Finding user by email: ", normalized);
  const users = await searchUsersByEmail({
    email: normalized,
    company_guid: req.user.company_guid,
    exact: true,
  }); // Assuming searchUsersByEmail is a function that searches for users by their email and returns matching users
  return res.json({ user: users.length > 0 ? users[0] : null });
};
export default {
  get,
  post,
  delete: deleteHandler,
  getMe,
  getCompany,
  searchUsers,
  findUserByEmail,
};
