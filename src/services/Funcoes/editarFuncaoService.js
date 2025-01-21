const db = require('../../database/database');

const aliasCampos = {
  diasJornada:'DiasJornada',
  funcao:'Descricao',
  horas:'HorasSemanais',
  descricao:'Detalhes'
}

const atualizarFuncao = async (target,dados,id,user) => {
  
  try{
    if(dados.diasJornada){
      dados.diasJornada = JSON.stringify(dados.diasJornada);
    }
    const con = await db.conectar(target,user)
    const campos = Object.keys(dados).map(alias=>aliasCampos[alias]) 
    const valores = Object.values(dados); 
    
    if(campos.length == 0){
        return{message:'Nenhum campo válido para atualização!'}
    }
    
    const query =  `
      UPDATE Funcoes
      SET ${campos.map((campo) => `${campo} = ?`).join(', ')}
      WHERE id = ?
    `
  
    valores.push(id)  
    await con.execute(query,valores);
    await con.end();
  
    return{
    statusCode:200,
    message:"Função Atualizada com sucesso" 
    }}
  
  catch(error){
     return{
        statusCode:500,
        message: error.message
     }
  }

};

module.exports = { atualizarFuncao };