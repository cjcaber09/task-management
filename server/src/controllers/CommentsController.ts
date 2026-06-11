import { createComment, getCommentsByTask } from "../models/comments.model";
import type { Request, Response } from "express";
export const post = async (req: Request, res: Response) => {
  try {
    const task_guid = req.params.guid as string;
    const { comment } = req.body;
    const user_guid = req.user?.guid; // Assuming you have user authentication and the user GUID is available in the request
    if (!task_guid) {
      return res.status(400).json({ error: "Task ID is required" });
    }
    // Validate input
    if (!comment || comment.trim() === "") {
      return res.status(400).json({ error: "Comment content is required" });
    }
    if (!user_guid) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Create a new comment
    const newComment = await createComment({
      comment,
      task_guid,
      user_guid,
    });
    return res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCommentsByTaskGuid = async (req: Request, res: Response) => {
  try {
    const task_guid = req.params.guid as string;
    if (!task_guid) {
      return res.status(400).json({ error: "Task ID is required" });
    }
    const comments = await getCommentsByTask(task_guid, ["user"]);
    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
