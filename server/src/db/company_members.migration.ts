const companyMembersSchema = `
CREATE TABLE IF NOT EXISTS company_members (
  guid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_guid UUID NOT NULL references company(guid) on delete cascade,
  user_guid UUID NOT NULL references users(guid) on delete cascade,
  role VARCHAR(20) NOT NULL DEFAULT 'member',
  status status_type NOT NULL DEFAULT 'active',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  UNIQUE (company_guid, user_guid)
);
CREATE INDEX IF NOT EXISTS idx_company_members_company_guid ON company_members (company_guid);
CREATE INDEX IF NOT EXISTS idx_company_members_user_guid ON company_members (user_guid);
`;

export default companyMembersSchema;
