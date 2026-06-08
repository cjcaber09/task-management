const taskAssigneeSchema = `
CREATE TABLE IF NOT EXISTS task_assignees (
  guid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_guid UUID NOT NULL references tasks(guid) on delete cascade,
  user_guid UUID NOT NULL references users(guid) on delete cascade
);
DROP INDEX IF EXISTS idx_task_assignees_task_guid;
DROP INDEX IF EXISTS idx_task_assignees_user_guid;
CREATE INDEX idx_task_assignees_task_guid ON task_assignees (task_guid);
CREATE INDEX idx_task_assignees_user_guid ON task_assignees (user_guid);
`;

export default taskAssigneeSchema;
