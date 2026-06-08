export type taskType = {
  guid: string;
  name: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  project_guid: string;
  company_guid: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type CreateTaskInput = Omit<
  taskType,
  "guid" | "created_at" | "updated_at" | "deleted_at"
>;

export type UpdateTaskInput = Partial<CreateTaskInput>;

export type TaskResponse = taskType | { error: string };
