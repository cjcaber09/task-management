const tableTrigger = (tableName: string, columnName: string) => {
  return `
  DROP FUNCTION IF EXISTS update_${columnName}_column CASCADE;
  DROP TRIGGER IF EXISTS update_${tableName}_${columnName} ON ${tableName} CASCADE;
   CREATE OR REPLACE FUNCTION update_${columnName}_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.${columnName} = NOW();
    RETURN NEW;
  END;
    $$ language 'plpgsql';

    CREATE TRIGGER update_${tableName}_${columnName}
    BEFORE UPDATE ON ${tableName}
    FOR EACH ROW
    EXECUTE FUNCTION update_${columnName}_column();
`;
};

export { tableTrigger };
