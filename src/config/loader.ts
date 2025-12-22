import { readFile } from "fs/promises";
import { resolve } from "path";

export interface AppConfig {
  input: string;
  database: any;
  csv: {
    separator: string;
    skipLines: number;
  };
  tables: Record<string, TableConfig>;
}

export interface TableConfig {
  primaryKey: string;
  exists: {
    query: string;
    paramFrom: string;
  };
  insert?: {
    query: string;
    params: string[];
  };
  update?: {
    query: string;
    params: string[];
  };
  onExists: "update" | "skip" | "error";
  onNotExists: "insert" | "skip" | "error";
}

export async function loadConfig(path: string): Promise<AppConfig> {
  try {
    const absolutePath = resolve(process.cwd(), path);
    const fileContent = await readFile(absolutePath, "utf-8");
    const config = JSON.parse(fileContent);

    // Basic validation could go here
    if (!config.input || !config.database || !config.tables) {
      throw new Error("Configuração inválida: campos obrigatórios faltando.");
    }

    return config;
  } catch (error: any) {
    throw new Error(`Erro ao carregar configuração: ${error.message}`);
  }
}
