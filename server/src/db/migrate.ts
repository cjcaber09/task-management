/**
 * Migration script to create tables using the files in the db directory.
 * It will run the migration scripts in the correct order to create the tables and migrate the existing data.
 * The order of migration is as follows:
 * 1. users.migration.ts
 * 2. projects.migration.ts
 * 3. tasks.migration.ts
 * 4. task_comment.migration.ts
 */

import userSchema from "./users.migration";
import projectSchema from "./projects.migration";
import taskSchema from "./tasks.migration";
import taskCommentSchema from "./task_comment.migration";
import pool from "./config";
import projectMembersSchema from "./project_members.migration";
import { createEnumType } from "./shared/types";
import companyMembersSchema from "./company_members.migration";
import companySchema from "./company.migration";
import taskAssigneeSchema from "./task_assignee.migration";

const migrate = async () => {
  // Run the migration scripts in the correct order
  console.log("Starting database migration...");
  //   Check DB connection
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed: ", error);
    process.exit(1);
  }
  const schemas = [
    { name: "company", schema: companySchema },
    {
      name: "users",
      schema: userSchema,
    },
    {
      name: "company_members",
      schema: companyMembersSchema,
    },
    {
      name: "projects",
      schema: projectSchema,
    },
    {
      name: "project_members",
      schema: projectMembersSchema,
    },
    {
      name: "tasks",
      schema: taskSchema,
    },
    {
      name: "task_assignees",
      schema: taskAssigneeSchema,
    },
    {
      name: "task_comments",
      schema: taskCommentSchema,
    },
  ];
  //   Query enum type to check if it exists before creating it
  const checkEnumType = async (typeName: string) => {
    const result = await pool.query(
      "SELECT 1 FROM pg_type WHERE typname = $1",
      [typeName],
    );
    if (result && result.rowCount && result.rowCount > 0) {
      return true;
    }
    return false;
  };

  //   Create enum types if they don't exist
  const enumTypes = [
    { name: "status_type", values: ["active", "archived"] },
    { name: "task_status", values: ["todo", "in_progress", "done"] },
    { name: "task_priority", values: ["low", "medium", "high"] },
  ];
  // create enum types if they don't exist
  for (const enumType of enumTypes) {
    const exists = await checkEnumType(enumType.name);
    if (!exists) {
      const createEnumQuery = `${createEnumType(enumType.name, enumType.values)}`;
      await pool.query(createEnumQuery);
      console.log(`Enum type ${enumType.name} created successfully`);
    } else {
      console.log(`Enum type ${enumType.name} already exists`);
    }
  }
  try {
    for (const { name, schema } of schemas) {
      await pool.query(schema);
    }
  } catch (error) {
    console.error("Migration failed: ", error);
    process.exit(1);
  }
  process.exit(0);
};

migrate();
