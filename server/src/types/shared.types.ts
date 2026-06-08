import pool from "../db/config/index";
// import { ProjectType  } from "./project.types";
import { ErrorResponse } from "./users.type";
import type { PoolClient } from "pg";

// AUTO-GENERATED SHARED EXPORTS START
// Copied from ../../../shared/types/project.ts
export type ProjectType = {
  guid: string;
  owner_guid: string;
  name: string;
  description: string;
  status: "active" | "archived";
  members?: MemberType[];
  company_guid: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type MemberType = {
  user_guid: string;
  role?: "owner" | "member";
  name?: string | null;
  email?: string | null;
  joined_at?: Date | null;
};
// Copied from ../../../shared/types/user.ts
import type { CompanyType } from "./company.types";

export type RegisterUserInput = {
  email: string;
  password: string;
  confirmPassword: string;
  userInfo: {
    name: string;
  };
  companyInfo?: CompanyType | null;
};

export type LoginUserInput = {
  email: string;
  password: string;
};

export type UserType = {
  guid: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};
// AUTO-GENERATED SHARED EXPORTS END

// export type MemberType = {
//   user_guid: string;
//   role?: "owner" | "member";
//   name?: string | null;
//   email?: string | null;
//   joined_at?: Date | null;
// };
export type MemberInputType = {
  user_guid: string;
  role?: "owner" | "member";
};
export type CreateProjectInput = Omit<
  ProjectType,
  "guid" | "created_at" | "updated_at" | "deleted_at"
>;

export type UpdateProjectInput = Partial<CreateProjectInput>;

export type ProjectResponse = ProjectType | ErrorResponse;

export type DBconnection = PoolClient | typeof pool;
