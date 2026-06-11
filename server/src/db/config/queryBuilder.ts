class QueryBuilder {
  private query: string;
  private params: any[];

  private shouldAddParam(condition: string, value: any): boolean {
    // Only append params when the condition uses placeholders, or when a real value is explicitly provided.
    const hasPlaceholder = /\$\d+/.test(condition);
    return hasPlaceholder || (value !== null && value !== undefined);
  }

  constructor() {
    this.query = "";
    this.params = [];
  }
  jsonAgg(column: string, alias: string): QueryBuilder {
    this.query += `JSON_AGG(JSON_BUILD_OBJECT(${column})) AS ${alias} `;
    return this;
  }
  select(
    table: string,
    columns: string[] = ["*"],
    alias: string = "",
  ): QueryBuilder {
    // add logic to handle JSON_AGG and JSON_BUILD_OBJECT

    this.query += `SELECT ${columns.join(", ")} FROM ${table} ${alias} `;
    return this;
  }

  where(condition: string, value: any): QueryBuilder {
    this.query += `WHERE ${condition} `;
    if (this.shouldAddParam(condition, value)) {
      this.params.push(value);
    }
    return this;
  }

  andWhere(condition: string, value: any): QueryBuilder {
    this.query += `AND ${condition} `;
    if (this.shouldAddParam(condition, value)) {
      this.params.push(value);
    }
    return this;
  }

  orWhere(condition: string, value: any): QueryBuilder {
    this.query += `OR ${condition} `;
    if (this.shouldAddParam(condition, value)) {
      this.params.push(value);
    }
    return this;
  }

  insertInto(table: string, data: { [key: string]: any }): QueryBuilder {
    const columns = Object.keys(data);
    const placeholders = columns.map((_, index) => `$${index + 1}`);
    this.query += `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders.join(", ")}) `;
    this.params.push(...Object.values(data));
    return this;
  }

  update(table: string, data: { [key: string]: any }): QueryBuilder {
    const setClauses = Object.keys(data).map(
      (key, index) => `${key} = $${index + 1}`,
    );
    this.query += `UPDATE ${table} SET ${setClauses.join(", ")} `;
    this.params.push(...Object.values(data));
    return this;
  }

  join(
    table: string,
    condition: string[],
    useAlias: boolean = true,
  ): QueryBuilder {
    // get alias from table name by taking the first letter of each word in the table name
    let alias = table
      .split("_")
      .map((word) => word[0])
      .join("");
    if (useAlias) {
      this.query += `JOIN ${table} ${alias}`;
    } else {
      this.query += `JOIN ${table}`;
    }
    condition.forEach((cond) => {
      if (useAlias) {
        this.query += ` ON ${alias}.${cond}`;
      } else {
        this.query += ` ON ${cond}`;
      }
    });
    this.query += " ";
    return this;
  }

  leftJoin(
    table: string,
    condition: string[],
    useAlias: boolean = true,
  ): QueryBuilder {
    // get alias from table name by taking the first letter of each word in the table name
    let alias = table
      .split("_")
      .map((word) => word[0])
      .join("");
    if (useAlias) {
      this.query += `LEFT JOIN ${table} ${alias}`;
    } else {
      this.query += `LEFT JOIN ${table}`;
    }
    condition.forEach((cond) => {
      if (useAlias) {
        this.query += ` ON ${alias}.${cond}`;
      } else {
        this.query += ` ON ${cond}`;
      }
    });
    this.query += " ";
    return this;
  }
  and(condition: string, value: any): QueryBuilder {
    this.query += `AND ${condition} `;
    if (this.shouldAddParam(condition, value)) {
      this.params.push(value);
    }
    return this;
  }
  groupBy(column: string): QueryBuilder {
    this.query += `GROUP BY ${column} `;
    return this;
  }
  build(): { query: string; params: any[] } {
    return { query: this.query.trim(), params: this.params };
  }
}

export default QueryBuilder;
