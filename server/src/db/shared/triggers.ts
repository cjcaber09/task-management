const ensureUpdateTimestampFunction = `
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`;

const tableTrigger = (tableName: string, columnName: string) => {
  if (columnName !== "updated_at") {
    throw new Error(
      `Unsupported trigger column: ${columnName}. Only updated_at is supported.`,
    );
  }

  return `
  DROP TRIGGER IF EXISTS update_${tableName}_${columnName} ON ${tableName};
  CREATE TRIGGER update_${tableName}_${columnName}
  BEFORE UPDATE ON ${tableName}
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();
`;
};

export { ensureUpdateTimestampFunction, tableTrigger };
