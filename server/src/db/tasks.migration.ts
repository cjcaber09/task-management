import { tableTrigger } from "./shared/triggers";
import { createEnumType } from "./shared/types";
/**
 * This file is responsible for migrating the tasks from the old schema to the new schema.
 * It will create a new table for tasks and migrate the existing tasks to the new table.
 * Tasks table schema:
 * - guid: UUID (Primary Key)
 * - project_guid: UUID (Foreign Key referencing projects(guid))
 * - task_name: VARCHAR(100) NOT NULL
 * - description: TEXT
 * - status: ENUM('todo', 'in_progress', 'done') NOT NULL DEFAULT 'todo'
 * - priority: ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium'
 * - created_at: TIMESTAMPTZ DEFAULT NOW()
 * - updated_at: TIMESTAMPTZ DEFAULT NOW()
 *
 * - Indexes:
 *   - project_guid: INDEX
 *   - task_name: INDEX
 *
 * - Constraints:
 *   - project_guid: NOT NULL, FOREIGN KEY
 *   - task_name: NOT NULL
 */

const taskSchema = `
CREATE TABLE IF NOT EXISTS tasks (
  guid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_guid UUID NOT NULL references projects(guid) on delete cascade,
    name varchar(100) not null,
    description text,
    status task_status not null default 'todo',
    priority task_priority not null default 'medium',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);
  CREATE INDEX IF NOT EXISTS idx_tasks_project_guid ON tasks (project_guid);
  CREATE INDEX IF NOT EXISTS idx_tasks_name ON tasks (name);
  CREATE INDEX IF NOT EXISTS idx_project_guid ON tasks (project_guid);
  ${tableTrigger("tasks", "updated_at")}
`;

export default taskSchema;
