export async function createDbAdapter(config: any) {
  if (config.type === "mysql") {
    const { createMysqlAdapter } = await import("./mysql.adapter");
    return createMysqlAdapter(config);
  }

  throw new Error("Banco não suportado");
}