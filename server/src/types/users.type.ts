export type UserType = {
  guid: string;
  email: string;
  name: string;
  company_guid: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type UserResponse = {
  guid: string;
  email: string;
  name: string | null;
  company_guid: string | null;
  created_at: Date;
  updated_at: Date;
};

export type RegisterResponse = {
  user: Omit<UserType, "password">;
  token: string;
};
export type ErrorResponse = {
  error: string;
};
