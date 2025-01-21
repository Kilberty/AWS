const db = require('../../database/database');

const autocompleteFuncionarios = async (target,user) => {
  const con = await db.conectar(target,user);
  const query = 'SELECT id, Nome FROM Funcionarios';
  const [rows] = await con.execute(query);
  await con.end();
  
  return rows.map(row => ({
    id: row.id,
    nome: row.Nome,
  }));
};

module.exports = {autocompleteFuncionarios};