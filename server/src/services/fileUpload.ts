/**
 * Supabase file upload service
 * This service provides functions to handle file uploads to Supabase storage.
 * It includes functions to upload files and retrieve signed URLs for accessing the files.
 */
import { error } from "console";
import { supabase } from "../supabase.config";

const uploadFileToSupabase = async (
  file: Express.Multer.File,
  guid: string,
) => {
  // Implement the logic to upload the file to Supabase storage
  // and return the file path or URL
  const { data, error } = await supabase.storage
    .from("task_management")
    .upload(`${guid}/${file.originalname}`, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });
  if (error) {
    throw new Error(error.message);
  }
  return data.path; // Return the file path for storage in the database
};

const createSignedUrlForSupabaseFile = (filePath: string) => {
  const { data } = supabase.storage
    .from("task_management")
    .getPublicUrl(filePath);
  return data.publicUrl;
};

export { uploadFileToSupabase, createSignedUrlForSupabaseFile };
