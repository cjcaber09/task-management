const projectMembersSchema = `
CREATE TABLE IF NOT EXISTS project_members (
  project_guid UUID NOT NULL references projects(guid) on delete cascade,
  user_guid UUID NOT NULL references users(guid) on delete cascade,
  role VARCHAR(20) NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (project_guid, user_guid)
);
DROP INDEX IF EXISTS idx_project_members_project_guid;
DROP INDEX IF EXISTS idx_project_members_user_guid;
CREATE INDEX idx_project_members_project_guid ON project_members (project_guid);
CREATE INDEX idx_project_members_user_guid ON project_members (user_guid);
`;

export default projectMembersSchema;
