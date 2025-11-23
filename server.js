const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, "database.json");

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// --- ESTA É A MÁGICA: SERVIR O SITE ---
// Diz ao servidor para entregar os arquivos da pasta atual (index.html)
app.use(express.static(__dirname));

// Função Banco de Dados
async function ensureDbExists() {
  try {
    await fs.access(DB_FILE);
  } catch (error) {
    const initialData = { efetivo: {}, log: [] };
    await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 4));
  }
}

// Rota API: Carregar
app.get("/api/load", async (req, res) => {
  try {
    await ensureDbExists();
    const data = await fs.readFile(DB_FILE, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Erro ao carregar" });
  }
});

// Rota API: Salvar
app.post("/api/save", async (req, res) => {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(req.body, null, 4));
    res.json({ status: "success" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar" });
  }
});

// Rota Principal (Garante que o index.html abra)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Sistema Online na porta ${PORT}`);
});
