import { Router } from "express";
import userRoutes from "./userRoutes.js";

const routes = Router();

routes.get("/", async (req, res) => {
  return res.json("Back - Musician & Match");
});

routes.use(userRoutes);

export default routes;
