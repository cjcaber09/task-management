const createEnumType = (typeName: string, values: string[]) => {
  const valuesList = values.map((value) => `'${value}'`).join(", ");
  return `
  DROP TYPE IF EXISTS ${typeName} CASCADE;
  CREATE TYPE ${typeName} AS ENUM (${valuesList});`;
};
export { createEnumType };
