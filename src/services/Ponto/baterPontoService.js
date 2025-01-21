const moment = require('moment-timezone');
const db = require('../../database/database')
const baterPonto = async (target, codigoPonto,user) => {
    const connection = await db.conectar(target,user);
    try {
        // Obter a data e hora atuais e converter para horário de Brasília
        const now = moment();
        const brasiliaDate = now.tz('America/Sao_Paulo');

        // Conectar ao banco de dados
       

        // Buscar funcionário pelo código
        const [funcionarios] = await connection.query(
            'SELECT * FROM Funcionarios WHERE Codigo = ?',
            [codigoPonto]
        );

        const funcionario = funcionarios[0];

        if (funcionario) {
            // Verificar se já existe um ponto para o funcionário na data atual
            const [pontos] = await connection.query(
                'SELECT * FROM RegistroPonto WHERE FuncionarioID = ? AND Data = ?',
                [funcionario.id, brasiliaDate.format('YYYY-MM-DD')]
            );

            let pontoExistente = pontos[0];

            if (pontoExistente) {
                // Atualizar a próxima coluna de ponto não preenchida
                if (!pontoExistente.HoraInicio) {
                    pontoExistente.HoraInicio = brasiliaDate.format('HH:mm:ss');
                    await connection.query(
                        'UPDATE RegistroPonto SET HoraInicio = ? WHERE id = ?',
                        [pontoExistente.HoraInicio, pontoExistente.id]
                    );
                } else if (!pontoExistente.HoraAlmoco) {
                    pontoExistente.HoraAlmoco = brasiliaDate.format('HH:mm:ss');
                    await connection.query(
                        'UPDATE RegistroPonto SET HoraAlmoco = ? WHERE id = ?',
                        [pontoExistente.HoraAlmoco, pontoExistente.id]
                    );
                } else if (!pontoExistente.HoraRetorno) {
                    pontoExistente.HoraRetorno = brasiliaDate.format('HH:mm:ss');
                    await connection.query(
                        'UPDATE RegistroPonto SET HoraRetorno = ? WHERE id = ?',
                        [pontoExistente.HoraRetorno, pontoExistente.id]
                    );
                } else if (!pontoExistente.HoraFim) {
                    pontoExistente.HoraFim = brasiliaDate.format('HH:mm:ss');
                    await connection.query(
                        'UPDATE RegistroPonto SET HoraFim = ? WHERE id = ?',
                        [pontoExistente.HoraFim, pontoExistente.id]
                    );
                } else {
                    return {
                        statusCode: 400,
                        message: 'Todos os pontos do dia já foram registrados'
                    };
                }

                return {
                    statusCode:200,
                    id: funcionario.id,
                    Codigo: funcionario.Codigo,
                    Nome: funcionario.Nome,
                    Data: brasiliaDate.format('YYYY-MM-DD'),
                    Hora: brasiliaDate.format('HH:mm:ss'),
                    message: 'Ponto atualizado com sucesso!'
                };
            } else {
                // Criar um novo registro de ponto
                await connection.query(
                    'INSERT INTO RegistroPonto (FuncionarioID, Data, HoraInicio) VALUES (?, ?, ?)',
                    [funcionario.id, brasiliaDate.format('YYYY-MM-DD'), brasiliaDate.format('HH:mm:ss')]
                );

                return {
                    statusCode: 200,
                    id: funcionario.id,
                    Codigo: funcionario.Codigo,
                    Nome: funcionario.Nome,
                    Data: brasiliaDate.format('YYYY-MM-DD'),
                    Hora: brasiliaDate.format('HH:mm:ss'),
                    message: 'Ponto salvo com sucesso!'
                };
            }
        } else {
            return {
                statusCode: 404,
                message: 'Funcionário não encontrado'
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            message: `Erro ao salvar ponto: ${error.message}`
        };
    } finally {
        if (connection) {
            await connection.end(); // Fechar a conexão com o banco de dados
        }
    }
};

module.exports = { baterPonto };
