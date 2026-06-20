const addAssignToTask = `
  ALTER TABLE tasks
    ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES users(guid) ON DELETE SET NULL;
`;

export default addAssignToTask;
