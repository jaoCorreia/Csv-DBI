#!/usr/bin/env bun

import { loadConfig, type AppConfig } from "../config/loader";
import { createEngine } from "../core/engine";
import { createDbAdapter } from "../db/adapter";
import { runInteractiveMode } from "./prompts";

const configPath = process.argv[2];
let config: AppConfig;

try {
  if (configPath) {
    console.log("🔧 Carregando configuração do arquivo...");
    config = await loadConfig(configPath);
  } else {
    config = await runInteractiveMode();
  }
  const db = await createDbAdapter(config.database);

  const engine = createEngine({ config, db });

  await engine.run();

  process.exit(0);
} catch (error: any) {
  console.error("\n❌ Erro fatal na inicialização:");
  console.error(error.message);
  process.exit(1);
}
