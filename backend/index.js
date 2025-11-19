// backend/index.js
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import pool from "./database/connection.js";

const app = express();
const PORT = 3000;

// middlewares
app.use(cors());
app.use(express.json());

// testar conexão com banco
pool.getConnection()
  .then(() => console.log("✅ Conectado ao MySQL com sucesso!"))
  .catch(err => console.error("❌ Erro ao conectar ao MySQL:", err));

// usar as rotas centralizadas
app.use(routes);

// iniciar servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
