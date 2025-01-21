const db = require('../../database/database');

const getFuncoes = async (target, user, funcao) => {
  const con = await db.conectar(target, user);
  let rows = [];

  try {
    if (!funcao) { // Verifica se funcao é vazio, nulo ou indefinido
      const query = 'SELECT id, Descricao, DiasJornada, Detalhes FROM Funcoes';
      [rows] = await con.execute(query);
    } else {
      const query = 'SELECT id, Descricao, DiasJornada, Detalhes FROM Funcoes WHERE Descricao LIKE ?';
      [rows] = await con.execute(query, [`%${funcao}%`]);
    }

    // Mapeia os resultados e retorna
    return {
      data: rows.map((row) => ({
        id: row.id,
        nome: row.Descricao,
        diasJornada: row.DiasJornada ? JSON.parse(row.DiasJornada) : null,
        descricao: row.Detalhes,
      })),
    };
  } catch (err) {
    console.error('Erro ao executar a consulta:', err);
    throw err;
  } finally {
    await con.end(); // Garante que a conexão será encerrada mesmo com erro
  }
};

module.exports = { getFuncoes };
