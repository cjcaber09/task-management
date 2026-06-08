export type ProjectType = {
  guid: string;
  owner_guid: string;
  name: string;
  description: string;
  status: "active" | "archived";
  task_count: number;
  members?: MemberType[];
  company_guid: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type MemberType = {
  guid: string;
  name: string;
  email: string;
  role: "owner" | "member";
  joined_at: Date;
};
