import type { AppConfig, TableConfig } from "../config/loader";
import { readCsv } from "../csv/reader";
import { Reporter } from "./reporter";

interface DbAdapter {
  exists(query: string, params: any[]): Promise<boolean>;
  execute(query: string, params: any[]): Promise<void>;
  close(): Promise<void>;
}

interface EngineDeps {
  config: AppConfig;
  db: DbAdapter;
}

export function createEngine({ config, db }: EngineDeps) {
  const reporter = new Reporter();

  function getParams(row: any, paramNames: string[]) {
    return paramNames.map((name) => {
      if (row[name] === undefined) {
        throw new Error(`Coluna '${name}' não encontrada no CSV.`);
      }
      return row[name];
    });
  }

  async function processTable(
    tableName: string,
    tableConfig: TableConfig,
    row: any
  ) {
    // 1. Check existence
    const existsParams = getParams(row, [tableConfig.exists.paramFrom]);
    const exists = await db.exists(tableConfig.exists.query, existsParams);

    // 2. Decide action
    const action = exists ? tableConfig.onExists : tableConfig.onNotExists;

    // 3. Execute action
    if (action === "skip") {
      reporter.incrementSkipped();
      return;
    }

    if (action === "error") {
      throw new Error(
        `Ação 'error' configurada para registro ${
          exists ? "existente" : "inexistente"
        } na tabela ${tableName}.`
      );
    }

    if (action === "insert") {
      if (!tableConfig.insert)
        throw new Error(`Configuração de insert ausente para ${tableName}`);
      const params = getParams(row, tableConfig.insert.params);
      await db.execute(tableConfig.insert.query, params);
      reporter.incrementInserted();
    } else if (action === "update") {
      if (!tableConfig.update)
        throw new Error(`Configuração de update ausente para ${tableName}`);
      const params = getParams(row, tableConfig.update.params);
      await db.execute(tableConfig.update.query, params);
      reporter.incrementUpdated();
    }
  }

  return {
    async run() {
      console.log("📂 Lendo CSV...");
      try {
        const rows = await readCsv(config.input, config.csv);
        console.log(`ℹ️  ${rows.length} linhas encontradas.`);

        for (const row of rows) {
          reporter.incrementTotal();
          try {
            // Process each table defined in config
            for (const [tableName, tableConfig] of Object.entries(
              config.tables
            )) {
              await processTable(tableName, tableConfig, row);
            }
            process.stdout.write("."); // Progress indicator
          } catch (error: any) {
            reporter.incrementErrors();
            console.error(
              `\n❌ Erro na linha ${reporter.stats.total}: ${error.message}`
            );
          }
        }
      } catch (error: any) {
        console.error("\n❌ Erro fatal:", error.message);
      } finally {
        await db.close();
        reporter.printSummary();
      }
    },
  };
}
