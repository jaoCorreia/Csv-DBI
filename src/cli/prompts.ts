import readline from "readline";
import { readHeaders } from "../csv/reader";
import type { AppConfig, TableConfig } from "../config/loader";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string, defaultValue?: string): Promise<string> {
  return new Promise((resolve) => {
    const q = defaultValue
      ? `${question} (${defaultValue}): `
      : `${question}: `;
    rl.question(q, (answer) => {
      resolve(answer.trim() || defaultValue || "");
    });
  });
}

export async function runInteractiveMode(): Promise<AppConfig> {
  console.log("\n🧙 Modo Interativo de Configuração\n");

  // 1. CSV Configuration
  const input = await ask("📂 Caminho do arquivo CSV");
  const separator = await ask("🔣 Separador do CSV", ";");
  const skipLinesStr = await ask("⏭️  Linhas para pular", "0");
  const skipLines = parseInt(skipLinesStr, 10);

  // 2. Database Configuration
  console.log("\n🔌 Configuração do Banco de Dados (MySQL)");
  const host = await ask("Host", "localhost");
  const user = await ask("Usuário", "root");
  const password = await ask("Senha", "");
  const database = await ask("Nome do Banco");

  // 3. Mapping
  console.log("\n🗺️  Mapeamento de Colunas");
  const tableName = await ask("Nome da Tabela no Banco");

  let headers: string[] = [];
  try {
    headers = await readHeaders(input, separator);
    console.log(
      `✅ CSV lido com sucesso. Colunas encontradas: ${headers.join(", ")}`
    );
  } catch (error: any) {
    console.error(`❌ Erro ao ler CSV: ${error.message}`);
    process.exit(1);
  }

  const mappings: { csv: string; db: string }[] = [];

  console.log(
    "\nPara cada coluna do CSV, informe o nome da coluna no banco (ou Enter para ignorar):"
  );

  for (const header of headers) {
    const dbCol = await ask(`   📄 ${header} -> 🗄️  DB Coluna`);
    if (dbCol) {
      mappings.push({ csv: header, db: dbCol });
    }
  }

  if (mappings.length === 0) {
    console.error("❌ Nenhuma coluna mapeada. Encerrando.");
    process.exit(1);
  }

  // 4. Primary Key Selection
  console.log("\n🔑 Definição de Chave Primária (para verificar existência)");
  console.log("Colunas mapeadas:");
  mappings.forEach((m, i) =>
    console.log(`   [${i}] CSV: ${m.csv} -> DB: ${m.db}`)
  );

  const pkIndexStr = await ask(
    "Qual o índice da coluna que é Chave Primária/Única?"
  );
  const pkIndex = parseInt(pkIndexStr, 10);

  if (isNaN(pkIndex) || !mappings[pkIndex]) {
    console.error("❌ Índice inválido.");
    process.exit(1);
  }

  const pkMapping = mappings[pkIndex];

  // 5. Construct Config
  const tableConfig: TableConfig = {
    primaryKey: pkMapping.db,
    exists: {
      query: `SELECT 1 FROM ${tableName} WHERE ${pkMapping.db} = ?`,
      paramFrom: pkMapping.csv,
    },
    insert: {
      query: `INSERT INTO ${tableName} (${mappings
        .map((m) => m.db)
        .join(", ")}) VALUES (${mappings.map(() => "?").join(", ")})`,
      params: mappings.map((m) => m.csv),
    },
    update: {
      query: `UPDATE ${tableName} SET ${mappings
        .filter((m) => m !== pkMapping)
        .map((m) => `${m.db} = ?`)
        .join(", ")} WHERE ${pkMapping.db} = ?`,
      params: [
        ...mappings.filter((m) => m !== pkMapping).map((m) => m.csv),
        pkMapping.csv,
      ],
    },
    onExists: "update",
    onNotExists: "insert",
  };

  rl.close();

  return {
    input,
    database: {
      type: "mysql",
      host,
      user,
      password,
      database,
    },
    csv: {
      separator,
      skipLines,
    },
    tables: {
      [tableName]: tableConfig,
    },
  };
}
