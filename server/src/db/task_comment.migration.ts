import { tableTrigger } from "./shared/triggers";
import { createEnumType } from "./shared/types";
/**
 * This file is responsible for migrating the task comments from the old schema to the new schema.
 * It will create a new table for task comments and migrate the existing task comments to the new table.
 * Task Comments table schema:
 * - guid: UUID (Primary Key)
 * - task_guid: UUID (Foreign Key referencing tasks(guid))
 * - user_guid: UUID (Foreign Key referencing users(guid))
 * - comment: TEXT NOT NULL
 * - created_at: TIMESTAMPTZ DEFAULT NOW()
 * - updated_at: TIMESTAMPTZ DEFAULT NOW()
 *
 * - Indexes:
 *   - task_guid: INDEX
 *   - user_guid: INDEX
 *
 * - Constraints:
 *   - task_guid: NOT NULL, FOREIGN KEY
 *   - user_guid: NOT NULL, FOREIGN KEY
 *   - comment: NOT NULL
 */

const taskCommentSchema = `
CREATE TABLE IF NOT EXISTS task_comments (
  guid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_guid UUID NOT NULL,
  user_guid UUID NOT NULL,
  comment TEXT NOT NULL,
  status status_type NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  FOREIGN KEY (task_guid) REFERENCES tasks(guid) ON DELETE CASCADE,
  FOREIGN KEY (user_guid) REFERENCES users(guid) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_task_comments_task_guid ON task_comments (task_guid);
CREATE INDEX IF NOT EXISTS idx_task_comments_user_guid ON task_comments (user_guid);

${tableTrigger("task_comments", "updated_at")}
`;

export default taskCommentSchema;
