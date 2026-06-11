import { tableTrigger } from "./shared/triggers";
import { createEnumType } from "./shared/types";
/**
 * This file is responsible for migrating the projects from the old schema to the new schema.
 * It will create a new table for projects and migrate the existing projects to the new table.
 * Projects table schema:
 * - owner_guid: UUID (Foreign Key referencing users(guid))
 * - name: VARCHAR(255) NOT NULL
 * - description: TEXT
 * - status: ENUM('active', 'archived') NOT NULL DEFAULT 'active'
 * - created_at: TIMESTAMPTZ DEFAULT NOW()
 * - updated_at: TIMESTAMPTZ DEFAULT NOW()
 *
 * - Indexes:
 *   - owner_guid: INDEX
 *
 * - Constraints:
 *   - owner_guid: NOT NULL, FOREIGN KEY
 *   - name: NOT NULL
 */

const ProjectSchema = `
CREATE TABLE IF NOT EXISTS projects (
  guid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_guid UUID NOT NULL references users(guid) on delete cascade,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  company_guid UUID references company(guid) on delete cascade,
  status status_type NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);
  CREATE INDEX IF NOT EXISTS idx_projects_owner_guid ON projects (owner_guid);
  ${tableTrigger("projects", "updated_at")}
`;

export default ProjectSchema;
