import pool from "../database/connection.js";

export class ContratacaoController {

  // ============================================================
  // 1) Criar nova contratação (POST /contratacoes)
  // ============================================================
  async create(req, res) {
    try {
      let {
        cpf_contratante,
        cpf_musico,
        nome_musico,
        nome_contratante,
        instrumentos,
        data_evento,
        horario,
        localizacao,
        observacoes,
        status = "pendente",
      } = req.body;

      if (!cpf_contratante || !cpf_musico) {
        return res.status(400).json({
          message: "cpf_contratante e cpf_musico são obrigatórios.",
        });
      }

      // Buscar nome do músico se não veio no body
      if (!nome_musico) {
        const [rowsM] = await pool.query(
          "SELECT nome FROM usuario WHERE cpf = ? LIMIT 1",
          [cpf_musico]
        );
        nome_musico = rowsM[0] ? rowsM[0].nome : null;
      }

      // Buscar nome do contratante se não veio
      if (!nome_contratante) {
        const [rowsC] = await pool.query(
          "SELECT nome FROM usuario WHERE cpf = ? LIMIT 1",
          [cpf_contratante]
        );
        nome_contratante = rowsC[0] ? rowsC[0].nome : null;
      }

      // Trata data_evento (permite DD/MM/YYYY ou YYYY-MM-DD)
      if (data_evento) {
        data_evento = data_evento.trim();
        if (data_evento.includes("/")) {
          const [dia, mes, ano] = data_evento.split("/");
          data_evento = `${ano}-${mes}-${dia}`;
        } else if (data_evento.includes("-")) {
          const partes = data_evento.split("-");
          if (partes[0].length === 2 && partes[2].length === 4) {
            const [dia, mes, ano] = partes;
            data_evento = `${ano}-${mes}-${dia}`;
          }
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(data_evento)) {
          return res.status(400).json({
            message: "Formato de data inválido. Use DD/MM/AAAA ou YYYY-MM-DD.",
          });
        }
      }

      const query = `
        INSERT INTO Contratacao
          (cpf_contratante, cpf_musico, nome_contratante, nome_musico, instrumentos,
           data_evento, horario, localizacao, observacoes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        cpf_contratante,
        cpf_musico,
        nome_contratante || null,
        nome_musico || null,
        instrumentos || null,
        data_evento || null,
        horario || null,
        localizacao || null,
        observacoes || null,
        status,
      ];

      const [result] = await pool.query(query, params);

      return res.status(201).json({
        message: "Contratação criada com sucesso!",
        id: result.insertId,
        contratacao: {
          id: result.insertId,
          cpf_contratante,
          cpf_musico,
          nome_contratante,
          nome_musico,
          data_evento,
          horario,
          localizacao,
          observacoes,
          status,
        },
      });

    } catch (error) {
      console.error("Erro ao criar contratação:", error);
      return res.status(500).json({
        message: "Erro ao criar contratação.",
        error: error.message,
      });
    }
  }

  // ============================================================
  // 2) Listar todas (GET /contratacoes)
  // ============================================================
  async readAll(req, res) {
    try {
      const [rows] = await pool.query(`
        SELECT * FROM Contratacao
        ORDER BY created_at DESC
      `);
      return res.status(200).json(rows);
    } catch (error) {
      console.error("Erro ao listar contratações:", error);
      return res.status(500).json({
        message: "Erro ao listar contratações.",
        error: error.message,
      });
    }
  }

  // ============================================================
  // 3) Buscar por ID (GET /contratacoes/:id)
  // ============================================================
  async readById(req, res) {
    try {
      const { id } = req.params;
      const [rows] = await pool.query(
        "SELECT * FROM Contratacao WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Contratação não encontrada." });
      }

      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error("Erro ao buscar contratação:", error);
      return res.status(500).json({
        message: "Erro ao buscar contratação.",
        error: error.message,
      });
    }
  }

  // ============================================================
  // 4) Listar contratações de um músico (GET /contratacoes/musico/:cpf)
  // ============================================================
  async readByMusico(req, res) {
    try {
      const { cpf } = req.params;
      const [rows] = await pool.query(
        "SELECT * FROM Contratacao WHERE cpf_musico = ? ORDER BY created_at DESC",
        [cpf]
      );
      return res.status(200).json(rows);
    } catch (error) {
      console.error("Erro ao listar contratações do músico:", error);
      return res.status(500).json({
        message: "Erro ao listar contratações.",
        error: error.message,
      });
    }
  }

  // ============================================================
  // 5) Deletar contratação (DELETE /contratacoes/:id)
  // ============================================================
  async delete(req, res) {
    try {
      const { id } = req.params;
      const [result] = await pool.query(
        "DELETE FROM Contratacao WHERE id = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Contratação não encontrada." });
      }

      return res.status(200).json({ message: "Contratação excluída com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir contratação:", error);
      return res.status(500).json({
        message: "Erro ao excluir contratação.",
        error: error.message,
      });
    }
  }

  // ============================================================
  // 6) Atualizar SOMENTE status (PUT /contratacoes/:id)
  // ============================================================
  async update(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Status é obrigatório." });
      }

      const [result] = await pool.query(
        "UPDATE Contratacao SET status = ? WHERE id = ?",
        [status, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Contratação não encontrada." });
      }

      return res.status(200).json({
        message: "Status atualizado com sucesso."
      });

    } catch (error) {
      console.error("Erro ao atualizar contratação:", error);
      return res.status(500).json({
        message: "Erro ao atualizar contratação.",
        error: error.message,
      });
    }
  }
}
