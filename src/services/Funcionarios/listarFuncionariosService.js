const db = require('../../database/database');

const listarFuncionarios = async (target, nome, codigoFuncionario, cpf, funcao, page, limit, user, ord) => {
    try {
        // Conectar ao banco de dados
        const database = target;
        const conn = await db.conectar(database, user);

        // Base da consulta SQL
        let baseQuery = `
          SELECT f.id, f.Nome, f.cpf, fu.Descricao AS DescricaoFuncao
          FROM Funcionarios f
          JOIN Funcoes fu ON f.Funcao = fu.id
        `;

        // Lista de condições e parâmetros
        let conditions = [];
        let params = [];

        // Adiciona as condições conforme os parâmetros
        if (nome) {
            conditions.push("f.Nome LIKE ?");
            params.push(`%${nome}%`);
        }
        if (cpf) {
            conditions.push("f.cpf = ?");
            params.push(cpf);
        }
        if (funcao) {
            conditions.push("f.Funcao = ?");
            params.push(funcao);
        }
        if (codigoFuncionario) {
            conditions.push("f.id = ?");
            params.push(codigoFuncionario);
        }

        // Se houver condições, adicione o WHERE
        if (conditions.length > 0) {
            baseQuery += " WHERE " + conditions.join(" AND ");
        }

        // Adiciona lógica para ordenação baseada em ord
        let orderByClause = "";
        if (ord === 1) {
            orderByClause = " ORDER BY f.Nome ASC"; // Ordem alfabética
        } else if (ord === 2) {
            orderByClause = " ORDER BY f.id ASC"; // Ordem pelo código
        }

        // Consulta para contar o total de registros
        const countQuery = `SELECT COUNT(*) AS total FROM (${baseQuery}) AS subquery`;
        const [[countResult]] = await conn.execute(countQuery, params);
        const totalRecords = countResult.total;

        // Adiciona LIMIT e OFFSET para paginação
        const offset = (page - 1) * limit;
        const paginatedQuery = `${baseQuery} ${orderByClause} LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        // Executa a consulta paginada
        const [rows] = await conn.execute(paginatedQuery, params);

        await conn.end();

        // Calcula o total de páginas
        const totalPages = Math.ceil(totalRecords / limit);

        return {
            data: rows.map(row => ({
                cod: row.id,
                nome: row.Nome,
                funcao: row.DescricaoFuncao,
                cpf: row.cpf
            })),
            totalRecords,
            totalPages,
            currentPage: page,
            pageSize: limit
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Erro ao listar funcionários", error: error.message })
        };
    }
};

module.exports = { listarFuncionarios };
