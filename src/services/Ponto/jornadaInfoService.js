const db = require('../../database/database');

const infoJornada = async (target, id,user) => {
    try {
        const con = await db.conectar(target,user);
        const query = 'SELECT DiasJornada, Horas FROM Funcionarios WHERE id = ?';
        const [rows] = await con.execute(query, [id]);
        await con.end();

        // Conversão das horas para minutos
        const totalMinutos = rows[0].Horas * 60;  // Multiplica as horas por 60 para obter minutos
     
        const diasTrabalho = Object.values(JSON.parse(rows[0].DiasJornada)).filter(dia=>dia === true).length
        return {
            diasJornada: rows[0].DiasJornada,
            Horas: totalMinutos,  // Retorna as horas em minutos
            quantidadeDiasExpediente: diasTrabalho
        };
    } catch (error) {
        return {
            statusCode: 500,
            message: error.message
        };
    }
};

module.exports = { infoJornada };
