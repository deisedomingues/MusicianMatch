import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { autenticarToken } from "../utils/authenticationToken.js";
// import {
//   solicitarRedefinicaoSenha,
//   resetarSenha,
// } from "../controllers/recuperarsenhaController.js";

const routes = Router();
const userController = new UserController();

/**
 * Rota POST /register
 * Cadastra um novo usuário na base de dados
 */

routes.post("/register", userController.create);

/**
 * Rota GET /
 * Lista todos os usuários
 */

routes.get("/users", userController.read);

/**
 * POST /login
 * Autentica o usuário e retorna um token JWT.
 */
routes.post("/login", userController.login);

/**
 * PUT /profile
 * Atualiza os dados de um usuario especifico
 */
routes.put("/profile/:cpf", autenticarToken, userController.update);

/**
 * DELETE /profile
 * Deleta os dados de um usuario especifico
 */
routes.delete("/profile/:cpf", autenticarToken, userController.delete);

// /**
//  * GET /users/:cpf
//  * Retorna um usuário específico pelo CPF
//  */
// routes.get("/users/:cpf", async (req, res) => {
//   const { cpf } = req.params;

//   try {
//     if (!/^[0-9]{11}$/.test(cpf)) {
//       return res.status(400).json({ message: "CPF inválido." });
//     }

//     const [rows] = await pool.query(
//       "SELECT cpf, nome, email, telefone, tipo FROM Usuario WHERE cpf = ?",
//       [cpf]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Usuário não encontrado." });
//     }

//     return res.status(200).json(rows[0]);
//   } catch (error) {
//     console.error("❌ Erro ao buscar usuário:", error);
//     return res.status(500).json({ message: "Erro interno no servidor." });
//   }
// });

// routes.post("/register-musico", async (req, res) => {
//   const { cpf_usuario, instrumentos, localizacao, descricao } = req.body;

//   if (!cpf_usuario || !instrumentos) {
//     return res
//       .status(400)
//       .json({ message: "CPF do usuário e instrumentos são obrigatórios!" });
//   }

//   try {
//     const [user] = await connection.query(
//       "SELECT * FROM Usuario WHERE cpf = ? AND tipo = ?",
//       [cpf_usuario, "musico"]
//     );

//     if (user.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "Usuário músico não encontrado!" });
//     }

//     // Atualizado: sem a coluna "avaliacao"
//     await connection.query(
//       "INSERT INTO Musico (cpf_usuario, instrumentos, localizacao, descricao) VALUES (?, ?, ?, ?)",
//       [cpf_usuario, instrumentos, localizacao || null, descricao || null]
//     );

//     return res
//       .status(201)
//       .json({ message: "Dados do músico cadastrados com sucesso!" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Erro interno do servidor." });
//   }
// });

// // Rota para atualizar um usuário
// routes.put("/users/:id", async (req, res) => {
//   const { id } = req.params;

//   const { nome, cpf, email, telefone, senha } = req.body;

//   const usuario = usersbd.find((user) => user.id === parseInt(id));

//   if (!usuario) {
//     return res.status(404).json({ message: "Usuário não encontrado." });
//   }

//   usuario.nome = nome || usuario.nome;
//   usuario.cpf = cpf || usuario.cpf;
//   usuario.email = email || usuario.email;
//   usuario.telefone = telefone || usuario.telefone;
//   usuario.senha = senha || usuario.senha;

//   return res
//     .status(201)
//     .json({ message: "Usuário atualizado com sucesso!", usuario: usuario });
// });

// // Rota para deletar um usuário
// routes.delete("/users/:id", async (req, res) => {
//   const { id } = req.params;

//   const index = usersbd.findIndex((user) => user.id === parseInt(id));
//   if (index === -1) {
//     return res.status(404).json({ message: "Usuário não encontrado." });
//   }

//   usersbd.splice(index, 1); // Remove o usuário do array

//   return res.status(200).json({ message: "Usuário deletado com sucesso." });
// });

// routes.post("/recuperar-senha", solicitarRedefinicaoSenha);
// //reseta e define
// routes.post("/resetar-senha", resetarSenha);

export default routes;
