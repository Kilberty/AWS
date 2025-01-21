const moment = require('moment-timezone');
const db = require('../../database/database')



const inserirHora = async(con,data,idFuncionario,ajuste,just)=>{
 const query = `INSERT INTO RegistroPonto(Data,FuncionarioID,HoraInicio,HoraAlmoco,HoraRetorno,HoraFim,Justificativa) VALUES (?,?,?,?,?,?,?)` 
 const values = [data,idFuncionario,ajuste,ajuste,ajuste,ajuste,just]
 con.execute(query,values)
}

const inserirPonto = async (target,idOperacao,datas,idFuncionario,just,user) => {
    const con = await db.conectar(target,user);
    try {
        let ajuste = null;
        switch (idOperacao) {
            case 1:
                ajuste = "00:00:00"//Falta
                break;
            case 2:
                ajuste = "01:01:01"//Atestado
                break;  
            case 3:
                ajuste = "02:02:02"//Férias
                break;          
            case 5:
                ajuste = "03:03:03"//Feriado
            default:
               throw new Error("Operação não reconhecida")     
        }

        for (const data of datas) {
            const dataFormatada = moment(data, 'DD/MM/YYYY').format('YYYY-MM-DD');
            await inserirHora(con,dataFormatada,idFuncionario,ajuste,just);
        }
    
        return{
            statusCode:200,
            message:"Pontos inseridos com sucesso!"
        } 
          
    }  catch (error) {
        return {
            statusCode: 500,
            message: `Erro ao inserir ponto: ${error.message}`
        };
    } finally {
        if (con) {
            await con.end(); // Fechar a conexão com o banco de dados
        }
    }
};

const ajustarPonto = async (target, idRegistro, ajuste, just) => {
    const con = await db.conectar(target);

    try {
        const query = `
            UPDATE RegistroPonto 
            SET HoraInicio = ?, HoraAlmoco = ?, HoraRetorno = ?, HoraFim = ?, Justificativa = ? 
            WHERE id = ?
        `;

        const values = [
            ajuste.HoraInicio || null, 
            ajuste.HoraAlmoco || null, 
            ajuste.HoraRetorno || null, 
            ajuste.HoraFim || null, 
            just || null, 
            idRegistro
        ];

        const [result] = await con.execute(query, values);

        if (result.affectedRows === 0) {
            throw new Error("Nenhum registro foi atualizado. Verifique se o ID é válido.");
        }

        return {
            statusCode: 200,
            message: "Ponto ajustado com sucesso",
            ajustes: {
                HoraInicio: ajuste.HoraInicio || null,
                HoraAlmoco: ajuste.HoraAlmoco || null,
                HoraRetorno: ajuste.HoraRetorno || null,
                HoraFim: ajuste.HoraFim || null,
                Justificativa: just || null
            }
        };
    } catch (error) {
        return {
            statusCode: 500,
            message: "Erro ao ajustar o ponto: " + error.message
        };
    } finally {
        if (con) {
            await con.end(); // Certifique-se de fechar a conexão
        }
    }
};













module.exports = { inserirPonto , ajustarPonto };
