import type { Response, Request } from "express";
import {
  registerUser,
  archiveUser,
  searchUsersByEmail,
  updateUserPassword,
  updateDBUserData,
  fetchUserByGuidOrEmail,
} from "../models/users.model";
import type {
  RegisterResponse,
  ErrorResponse,
  UpdatePasswordRequest,
  UserType,
} from "../types/users.type";
import { getCompanyByUserGuid } from "../models/company.model"; // Assuming this function fetches the company associated with the user's GUID
import {
  uploadFileToSupabase,
  createSignedUrlForSupabaseFile,
} from "../services/fileUpload";
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
    // return the user data without the password field
    const user = await fetchUserByGuidOrEmail({
      guid: req.user.guid,
    });
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
  const users = await searchUsersByEmail({
    email: normalized,
    company_guid: req.user.company_guid,
    exact: true,
  }); // Assuming searchUsersByEmail is a function that searches for users by their email and returns matching users
  // return res.json({ user: Array.isArray(users) && users.length > 0 ? users[0] : null });
  if (!Array.isArray(users) || users.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json({
    user: users[0],
  });
};

const updatePassword = async (
  req: Request<{ guid: UserType["guid"] }, {}, UpdatePasswordRequest>,
  res: Response,
) => {
  const { guid } = req.params;
  const { oldPassword, newPassword } = req.body;
  // Assume the inputs are correct as it is validated by the validation middleware before reaching this controller
  try {
    // Assuming you have a function to update the user's password in your model
    const updatedUser = await updateUserPassword(
      guid,
      oldPassword,
      newPassword,
    ); // Replace with your actual function to update the password

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({
      message: "Password updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating password:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }
};

const updateUserData = async (
  req: Request<{ guid: string }>,
  res: Response,
) => {
  // file upload logic here
  const file = req.file; // Assuming you're using multer or a similar middleware for file uploads

  try {
    const { guid } = req.params;
    const { name, firstName, lastName, address, contact_info } = req.body;
    // upload the file to supabase storage and get the file path
    if (!guid) return res.status(400).json({ error: "User GUID is required" });
    let filePath: string | null = null;
    let profile_image_url: string | null = null;
    let attachment_info: UserType["attachment_info"] | null = null;
    if (file) {
      filePath = await uploadFileToSupabase(file, guid); // Implement this function to handle the file upload
      if (filePath) {
        // Update the user's profile image path in the database
        // Assuming you have a function to update the user's profile image path in your model
        // get signed URL for the uploaded file from Supabase
        profile_image_url = createSignedUrlForSupabaseFile(filePath); // Implement this function to get the signed URL for the uploaded file
        // get the attachment_info from the database and update it with the new file path
        attachment_info = {
          profile_image_name: file.originalname,
          profile_image_mimetype: file.mimetype,
          profile_image_size: file.size,
          uploaded_at: new Date(),
        };
      }
    }
    const user = await updateDBUserData(guid, {
      name,
      first_name: firstName,
      last_name: lastName,
      address: address ? JSON.parse(address) : undefined,
      contact_info: contact_info ? JSON.parse(contact_info) : undefined,
      profile_image_url,
      attachment_info: attachment_info ? attachment_info : null,
    }); // Implement this function to update user data in your database
    res.json({ message: "User data updated successfully", user });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export default {
  get,
  post,
  delete: deleteHandler,
  getMe,
  getCompany,
  searchUsers,
  findUserByEmail,
  updatePassword,
  updateUserData,
};
