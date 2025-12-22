export class Reporter {
  stats = {
    total: 0,
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    startTime: Date.now(),
  };

  incrementTotal() {
    this.stats.total++;
  }

  incrementInserted() {
    this.stats.inserted++;
  }

  incrementUpdated() {
    this.stats.updated++;
  }

  incrementSkipped() {
    this.stats.skipped++;
  }

  incrementErrors() {
    this.stats.errors++;
  }

  printSummary() {
    const duration = ((Date.now() - this.stats.startTime) / 1000).toFixed(2);
    console.log("\n📊 Relatório Final:");
    console.log(`-------------------`);
    console.log(`Total processado: ${this.stats.total}`);
    console.log(`✅ Inseridos:     ${this.stats.inserted}`);
    console.log(`🔄 Atualizados:   ${this.stats.updated}`);
    console.log(`⏭️  Ignorados:     ${this.stats.skipped}`);
    console.log(`❌ Erros:         ${this.stats.errors}`);
    console.log(`⏱️  Tempo total:   ${duration}s`);
    console.log(`-------------------`);
  }
}
