export type UserType = {
  guid: string;
  email: string;
  name: string;
  company_guid: string;
  password: string;
  first_name: string;
  last_name: string;
  attachment_info?: {
    profile_image_name: string;
    profile_image_mimetype: string;
    profile_image_size: number;
    uploaded_at: Date;
  } | null;
  contact_info?: {
    phone: string;
    email: string;
  } | null;
  address?: {
    city: string;
    state: string;
    zipCode: string;
    street: string;
  } | null;
  profile_image_url?: string | null;
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

export type UpdatePasswordRequest = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
