const moment = require('moment-timezone');
const db = require('../../database/database')
const axios = require('axios')
const baterPonto = async (target, data, empresaID,user) => {
    const connection = await db.conectar(target,user);
    try {
        // Obter a data e hora atuais e converter para horário de Brasília
        const now = moment();
        const brasiliaDate = now.tz('America/Sao_Paulo');
         const requestBody = {
                id: data.id,
                empresaID: empresaID
           }

            
            const response = await axios.post('https://ponto.servicesapis.com/Ponto/BaterPonto', requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                     // Substitua pelo token apropriado, se necessário
                }
            });
            
            
            if (response.status !== 200) {
                return {
                    statusCode: response.status,
                    message: response.message
                };
            }
        
            const [pontos] = await connection.query(
                'SELECT * FROM RegistroPonto WHERE FuncionarioID = ? AND Data = ?',
                [data.id, brasiliaDate.format('YYYY-MM-DD')]
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
                    id: data.id,
                    Codigo: data.Codigo,
                    Nome: data.Nome,
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
                    id: data.id,
                    Codigo: data.Codigo,
                    Nome: data.Nome,
                    Data: brasiliaDate.format('YYYY-MM-DD'),
                    Hora: brasiliaDate.format('HH:mm:ss'),
                    message: 'Ponto salvo com sucesso!'
                };
            }
       
        }  catch (error) {
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
