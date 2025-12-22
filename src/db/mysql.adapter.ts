import mysql from "mysql2/promise";

export async function createMysqlAdapter(config: any) {
  const conn = await mysql.createConnection(config);

  return {
    async exists(query: string, params: any[]) {
      const [rows] = await conn.execute(query, params);
      return Array.isArray(rows) && rows.length > 0;
    },

    async execute(query: string, params: any[]) {
      await conn.execute(query, params);
    },

    async close() {
      await conn.end();
    },
  };
}