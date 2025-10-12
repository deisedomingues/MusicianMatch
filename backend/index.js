import express from "express";
import routes from "./routes/index.js";
import cors from "cors";

const app = express();
const port = 3000;

const corsOptions = {
  origin: "*",
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(routes);

app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});
