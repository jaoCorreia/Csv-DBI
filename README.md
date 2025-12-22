# CSV-DBI 📊🔌

**CSV Database Injector** é uma ferramenta CLI robusta para ingestão inteligente de dados CSV em bancos de dados.

## 🚀 Visão Geral

O CSV-DBI não é apenas um script de importação. É um motor de decisão que lê arquivos CSV, verifica a existência de registros no banco de dados e executa ações configuráveis (Inserir, Atualizar, Ignorar) com base em regras declarativas.

## ✨ Funcionalidades

- **Modo Interativo**: Assistente CLI que guia a configuração passo-a-passo (sem precisar editar JSON).
- **Configuração Declarativa**: Para usuários avançados, tudo pode ser definido em um arquivo JSON.
- **Motor de Decisão**: Lógica inteligente de `upsert` (insert ou update) baseada em verificação de existência.
- **Agnóstico de Banco**: Arquitetura pronta para múltiplos bancos (atualmente suporta MySQL).
- **Feedback Visual**: Relatórios detalhados no terminal sobre o progresso e resultados.
- **Alta Performance**: Construído sobre Bun para inicialização rápida e execução eficiente.

## 🛠️ Instalação

```bash
# Clone o repositório
git clone https://github.com/jaoCorreia/Csv-DBI.git
cd csv-dbi

# Instale as dependências
bun install
```

## 📖 Como Usar

### 1. Modo Interativo (Recomendado)

Basta rodar o comando sem argumentos. O assistente irá perguntar o caminho do CSV, credenciais do banco e ajudar no mapeamento das colunas.

```bash
bun run dev
```

### 2. Modo Avançado (Arquivo de Configuração)

Para automação ou pipelines, você pode passar um arquivo de configuração JSON diretamente:

```bash
bun run dev meu-projeto.json
```

**Exemplo de `meu-projeto.json`:**

```json
{
  "input": "dados.csv",
  "database": {
    "type": "mysql",
    "host": "localhost",
    "user": "root",
    "password": "password",
    "database": "meu_banco"
  },
  "csv": {
    "separator": ";",
    "skipLines": 1
  },
  "tables": {
    "usuarios": {
      "primaryKey": "id",
      "exists": {
        "query": "SELECT 1 FROM usuarios WHERE email = ?",
        "paramFrom": "EMAIL"
      },
      "insert": {
        "query": "INSERT INTO usuarios (nome, email) VALUES (?, ?)",
        "params": ["NOME", "EMAIL"]
      },
      "update": {
        "query": "UPDATE usuarios SET nome = ? WHERE email = ?",
        "params": ["NOME", "EMAIL"]
      },
      "onExists": "update",
      "onNotExists": "insert"
    }
  }
}
```

### Compilando para Binário

Você pode gerar um executável único para distribuir:

```bash
bun run build
./csv-dbi
```

## 🏗️ Estrutura do Projeto

- `src/cli`: Interface de linha de comando e entrada do programa.
- `src/config`: Carregamento e validação de configurações.
- `src/core`: Motor de decisão e relatórios.
- `src/db`: Adaptadores de banco de dados.
- `src/csv`: Leitura e parsing de arquivos CSV.

## 📝 Licença

MIT
Node.js: The runtime environment for the application.
csv-parser: A fast and lightweight CSV parsing library used to process CSV files.
Database Libraries: Install the necessary library depending on your database (e.g., mysql2 for MySQL, pg for PostgreSQL).

Conclusion
This application makes inserting large CSV datasets into databases a breeze! With a simple setup, you can automate data migration in just a few steps. (\@\_@/)
