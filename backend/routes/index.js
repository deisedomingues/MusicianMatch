// backend/routes/index.js
import { Router } from "express";
import userRoutes from "./userRoutes.js";
import contratacaoRoutes from "./contratacaoRoutes.js";

const routes = Router();

// rota de teste principal
routes.get("/", (req, res) => {
  return res.json("Back - Musician & Match");
});

// rotas de usuários
routes.use(userRoutes);

// rotas de contratações
routes.use("/contratacoes", contratacaoRoutes);

export default routes;
