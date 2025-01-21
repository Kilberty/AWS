const db = require('../../database/database');

const idFuncao = async (target, id,user) => {
    const database = target;
    const idFuncao = id;
    
    // Conecta ao banco de dados
    const con = await db.conectar(database,user);
    
    // Consulta SQL
    const query = `SELECT * from Funcoes where id = ?`;

    // Executa a consulta
    const [rows] = await con.execute(query, [idFuncao]);

    // Mapeia os resultados
    const result = rows.map(row => ({
        id: row.id,
        funcao: row.Descricao,
        descricao: row.Detalhes,
        diasJornada: row.DiasJornada,
        horasSemanais: row.HorasSemanais
    }));

    // Fecha a conexão
    await con.end();

    // Retorna o resultado
    return {
        statusCode: 200,
        data:result
    };
};

module.exports = { idFuncao };
