import { MemberType } from "./shared.types";

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
