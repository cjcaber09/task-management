import { tableTrigger } from "./shared/triggers";
/**
 * This file is responsible for migrating the company from the old schema to the new schema.
 * It will create a new table for company and migrate the existing company to the new table.
 * Company table schema:
 * - guid: UUID (Primary Key)
 * - name: VARCHAR(255) NOT NULL
 * - created_at: TIMESTAMPTZ DEFAULT NOW()
 * - updated_at: TIMESTAMPTZ DEFAULT NOW()
 *
 * - Indexes:
 *   - guid: PRIMARY KEY
 *
 * - Constraints:
 *   - name: NOT NULL
 *   - deleted_at: DEFAULT NULL
 */

const companySchema = `

CREATE TABLE IF NOT EXISTS company (
  guid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  status status_type NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);
CREATE INDEX IF NOT EXISTS idx_company_guid ON company (guid);
${tableTrigger("company", "updated_at")}
`;

export default companySchema;
