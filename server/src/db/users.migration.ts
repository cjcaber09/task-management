import { tableTrigger } from "./shared/triggers";
/**
 * This file is responsible for migrating the users from the old schema to the new schema.
 * It will create a new table for users and migrate the existing users to the new table.
 * Users table schema:
 * - guid: UUID (Primary Key)
 * - name: VARCHAR(255) NOT NULL
 * - email: VARCHAR(255) NOT NULL UNIQUE
 * - password: VARCHAR(255) NOT NULL
 * - created_at: TIMESTAMPTZ DEFAULT NOW()
 * - updated_at: TIMESTAMPTZ DEFAULT NOW()
 *
 * - Indexes:
 *   - email: UNIQUE
 *   - guid: PRIMARY KEY
 *
 * - Constraints:
 *   - email: NOT NULL, UNIQUE
 *   - name: NOT NULL
 *   - password: NOT NULL
 *   - deleted_at: DEFAULT NULL
 */
const userSchema = `
CREATE TABLE IF NOT EXISTS users (
  guid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_guid UUID references company(guid) on delete cascade,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);
  DROP INDEX IF EXISTS idx_users_email;
  DROP INDEX IF EXISTS idx_users_guid;
  CREATE INDEX idx_users_email ON users (email);
  CREATE INDEX idx_users_guid ON users (guid);
  ${tableTrigger("users", "updated_at")}
`;

// TODO: Migrate existing users to the new schema using pg

export default userSchema;
