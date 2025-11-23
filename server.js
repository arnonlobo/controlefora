const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000; // Porta 5000 para bater com o HTML
const DB_FILE = path.join(__dirname, "database.json");

// Middleware
app.use(cors()); // Permite conexão do HTML
app.use(express.json({ limit: "50mb" })); // Permite dados grandes

// Função para garantir que o arquivo existe
async function ensureDbExists() {
  try {
    await fs.access(DB_FILE);
  } catch (error) {
    const initialData = { efetivo: {}, log: [] };
    await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 4));
  }
}

// Rota: Carregar Dados
app.get("/api/load", async (req, res) => {
  try {
    await ensureDbExists();
    const data = await fs.readFile(DB_FILE, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    console.error("Erro ao ler banco:", error);
    res.status(500).json({ error: "Erro ao carregar dados" });
  }
});

// Rota: Salvar Dados
app.post("/api/save", async (req, res) => {
  try {
    const data = req.body;
    // Salva formatado para ficar legível se você abrir o arquivo
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 4));
    res.json({ status: "success" });
  } catch (error) {
    console.error("Erro ao salvar:", error);
    res.status(500).json({ error: "Erro ao salvar dados" });
  }
});

// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Rodando em http://localhost:${PORT}`);
  console.log(`📂 Salvando dados em: ${DB_FILE}`);
});
