const addLastnameAndAddressColumns = `
  ALTER TABLE users
    ADD COLUMN IF NOT EXISTS first_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS last_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS address JSONB,
    ADD COLUMN IF NOT EXISTS contact_info JSONB,
    ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(255),
    ADD COLUMN IF NOT EXISTS attachment_info JSONB;
`;

export default addLastnameAndAddressColumns;
