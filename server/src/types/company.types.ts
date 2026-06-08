export type CompanyType = {
  guid: string;
  name: string;
  status: "active" | "archived";
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};
