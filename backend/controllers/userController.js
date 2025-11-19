import pool from "../database/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export class UserController {
  async create(req, res) {
    const {
      nome,
      email,
      telefone,
      senha,
      cpf,
      tipo,
      instrumentos,
      localizacao,
      descricao,
    } = req.body;

    try {
      // 🔍 Validações básicas
      if (!nome || !email || !telefone || !senha || !cpf || !tipo) {
        return res
          .status(400)
          .json({ message: "Todos os campos são obrigatórios." });
      }

      if (senha.length < 6) {
        return res
          .status(400)
          .json({ message: "A senha deve ter pelo menos 6 caracteres." });
      }

      if (!/^[0-9]{11}$/.test(cpf)) {
        return res
          .status(400)
          .json({ message: "CPF inválido. Deve conter 11 dígitos numéricos." });
      }

      if (!["comum", "musico"].includes(tipo)) {
        return res.status(400).json({ message: "Tipo de usuário inválido." });
      }

      // 🔐 Verifica se já existe usuário com mesmo CPF ou email
      const [usuariosExistentes] = await pool.query(
        "SELECT cpf, email FROM usuario WHERE email = ? OR cpf = ?",
        [email, cpf]
      );

      if (usuariosExistentes.length > 0) {
        const conflito =
          usuariosExistentes[0].email === email ? "E-mail" : "CPF";
        return res.status(409).json({ message: `${conflito} já cadastrado.` });
      }

      // 🔒 Criptografa a senha
      const hashSenha = await bcrypt.hash(senha, 12);

      await pool.query(
        `INSERT INTO usuario (cpf, nome, email, senha, telefone, tipo)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [cpf, nome.trim(), email.trim(), hashSenha, telefone.trim(), tipo]
      );

      if (tipo === "musico") {
        await pool.query(
          `INSERT INTO musico (cpf_usuario, instrumentos, localizacao, descricao, avaliacao)
        VALUES (?, ?, ?, ?, 0.00)`,
          [cpf, instrumentos.trim(), localizacao.trim(), descricao.trim()]
        );
      }

      return res
        .status(201)
        .json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
      console.error("❌ Erro ao cadastrar usuário:", error);
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

 async getByCpf(req, res) {
    const { cpf } = req.params;
    try {
      // 2. Query SQL para selecionar um usuário específico pelo CPF
      const [usuarios] = await pool.query(
        `
            SELECT 
                u.cpf, 
                u.nome, 
                u.email, 
                u.telefone, 
                u.tipo,
                m.instrumentos,
                m.avaliacao,
                m.localizacao,
                m.descricao
            FROM usuario u
            LEFT JOIN musico m ON u.cpf = m.cpf_usuario
            WHERE u.cpf = ?  /* <--- Adição da cláusula WHERE e uso de '?' para segurança */
        `,
        [cpf]
      );
      const user = usuarios[0];
      if (!user) {
        // Nenhum usuário com o CPF fornecido foi encontrado
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      // 4. Retorna o único usuário encontrado
      return res.status(200).json(user);
    } catch (error) {
      console.error(`❌ Erro ao buscar usuário com CPF ${cpf}:`, error);
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }


  async read(req, res) {
    try {
      const [usuarios] = await pool.query(`
      SELECT 
        u.cpf, 
        u.nome, 
        u.email, 
        u.telefone, 
        u.tipo,
        m.instrumentos,
        m.avaliacao,
        m.localizacao,
        m.descricao
      FROM usuario u
      LEFT JOIN musico m ON u.cpf = m.cpf_usuario
    `);

      if (usuarios.length === 0) {
        return res.status(200).json({ message: "Nenhum usuário encontrado." });
      }

      return res.status(200).json(usuarios);
    } catch (error) {
      console.error("❌ Erro ao buscar usuários:", error);
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  async login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ message: "E-mail e senha são obrigatórios." });
    }

    try {
      // 🔎 Busca usuário pelo e-mail
      const [rows] = await pool.query("SELECT * FROM usuario WHERE email = ?", [
        email,
      ]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      const usuario = rows[0];

      // 🔐 Compara a senha informada com o hash no banco
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ message: "Senha incorreta." });
      }

      // Cria o token JWT
      const token = jwt.sign(
        {
          cpf: usuario.cpf,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.tipo,
        },
        JWT_SECRET,
        { expiresIn: "8h" } // o token expira em 8 horas
      );

      // 🧹 Remove a senha do retorno
      const { senha: _, ...dadoDoUsuario } = usuario;

      return res.status(200).json({
        message: "Login realizado com sucesso!",
        usuario: dadoDoUsuario,
        token,
      });
    } catch (error) {
      console.error("❌ Erro ao fazer login:", error);
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  async update(req, res) {
    const { nome, telefone, senha } = req.body;
    const { cpf } = req.user;

    try {
      // 🔍 Verifica se o usuário existe
      const [rows] = await pool.query("SELECT * FROM usuario WHERE cpf = ?", [
        cpf,
      ]);
      if (rows.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      // 🔐 Se senha foi enviada, criptografa
      let novaSenha = rows[0].senha;
      if (senha) {
        if (senha.length < 6) {
          return res
            .status(400)
            .json({ message: "A senha deve ter pelo menos 6 caracteres." });
        }
        novaSenha = await bcrypt.hash(senha, 10);
      }

      // 🧩 Monta os campos para update (só atualiza o que foi enviado)
      const campos = [];
      const valores = [];

      if (nome) {
        campos.push("nome = ?");
        valores.push(nome);
      }
      if (telefone) {
        campos.push("telefone = ?");
        valores.push(telefone);
      }
      if (senha) {
        campos.push("senha = ?");
        valores.push(novaSenha);
      }

      if (campos.length === 0) {
        return res
          .status(400)
          .json({ message: "Nenhum campo para atualizar." });
      }

      valores.push(cpf); // último valor para o WHERE

      // 🧱 Executa o update
      await pool.query(
        `UPDATE usuario SET ${campos.join(", ")} WHERE cpf = ?`,
        valores
      );

      // Faz uma nova consulta para obter o objeto completo e atualizado
      const [updatedRows] = await pool.query(
        "SELECT * FROM usuario WHERE cpf = ?",
        [cpf]
      );

      const usuarioAtualizado = updatedRows[0];

      // Remove a senha do objeto antes de enviar
      const { senha: _, ...dadoDoUsuarioAtualizado } = usuarioAtualizado;

      return res.status(200).json({
        message: "Dados atualizados com sucesso!",
        usuario: dadoDoUsuarioAtualizado,
      });
    } catch (error) {
      console.error("❌ Erro ao atualizar usuário:", error);
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  async delete(req, res) {
    const { cpf } = req.user;
    try {
      // 🔎 Verifica se o usuário existe
      const [rows] = await pool.query("SELECT * FROM usuario WHERE cpf = ?", [
        cpf,
      ]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      // 🧱 Remove o usuário
      await pool.query("DELETE FROM usuario WHERE cpf = ?", [cpf]);

      return res.status(200).json({ message: "Usuário excluído com sucesso." });
    } catch (error) {
      console.error("❌ Erro ao excluir usuário:", error);
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }
}
