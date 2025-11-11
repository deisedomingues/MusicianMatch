// backend/controllers/contratacaoController.js
import pool from "../database/connection.js";

export class ContratacaoController {
  // Criar nova contratação (POST /contratacoes)
  async create(req, res) {
    try {
      let {
        cpf_contratante,
        cpf_musico,
        nome_musico,
        instrumentos,
        data_evento,
        horario,
        localizacao,
        observacoes,
        status = "pendente",
      } = req.body;

      // Validação básica
      if (!cpf_contratante || !cpf_musico) {
        return res.status(400).json({
          message: "cpf_contratante e cpf_musico são obrigatórios.",
        });
      }

      // ✅ Conversão de data (para formato aceito pelo MySQL: YYYY-MM-DD)
      if (data_evento) {
        // Remove espaços extras
        data_evento = data_evento.trim();

        // Se vier em formato brasileiro (12/11/2025 ou 12-11-2025)
        if (data_evento.includes("/")) {
          const [dia, mes, ano] = data_evento.split("/");
          data_evento = `${ano}-${mes}-${dia}`;
        } else if (data_evento.includes("-")) {
          const partes = data_evento.split("-");
          // Verifica se está no formato DD-MM-YYYY
          if (partes[0].length === 2 && partes[2].length === 4) {
            const [dia, mes, ano] = partes;
            data_evento = `${ano}-${mes}-${dia}`;
          }
        }

        // Valida se a data realmente ficou no formato certo
        if (!/^\d{4}-\d{2}-\d{2}$/.test(data_evento)) {
          return res.status(400).json({
            message: "Formato de data inválido. Use DD/MM/AAAA ou YYYY-MM-DD.",
          });
        }
      }

      const query = `
        INSERT INTO Contratacao
          (cpf_contratante, cpf_musico, nome_musico, instrumentos, data_evento, horario, localizacao, observacoes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        cpf_contratante,
        cpf_musico,
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
      });
    } catch (error) {
      console.error("Erro ao criar contratação:", error);
      return res
        .status(500)
        .json({ message: "Erro ao criar contratação.", error: error.message });
    }
  }

  // Listar todas as contratações (GET /contratacoes)
  async readAll(req, res) {
    try {
      const [rows] = await pool.query(`
        SELECT *
        FROM Contratacao
        ORDER BY created_at DESC
      `);
      return res.status(200).json(rows);
    } catch (error) {
      console.error("Erro ao listar contratações:", error);
      return res
        .status(500)
        .json({ message: "Erro ao listar contratações.", error: error.message });
    }
  }

  // Buscar por ID (GET /contratacoes/:id)
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
      return res
        .status(500)
        .json({ message: "Erro ao buscar contratação.", error: error.message });
    }
  }

  // Listar contratações de um músico (GET /contratacoes/musico/:cpf)
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

  // Deletar (DELETE /contratacoes/:id)
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

      return res
        .status(200)
        .json({ message: "Contratação excluída com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir contratação:", error);
      return res
        .status(500)
        .json({ message: "Erro ao excluir contratação.", error: error.message });
    }
  }

  // Atualizar status/dados (PUT /contratacoes/:id)
  async update(req, res) {
    try {
      const { id } = req.params;
      let { data_evento, horario, localizacao, observacoes, status } = req.body;

      // ✅ Mesmo tratamento de data para atualização
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
      }

      const [result] = await pool.query(
        `UPDATE Contratacao
         SET data_evento = ?, horario = ?, localizacao = ?, observacoes = ?, status = ?
         WHERE id = ?`,
        [
          data_evento || null,
          horario || null,
          localizacao || null,
          observacoes || null,
          status || null,
          id,
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Contratação não encontrada." });
      }

      return res
        .status(200)
        .json({ message: "Contratação atualizada com sucesso." });
    } catch (error) {
      console.error("Erro ao atualizar contratação:", error);
      return res
        .status(500)
        .json({ message: "Erro ao atualizar contratação.", error: error.message });
    }
  }
}
