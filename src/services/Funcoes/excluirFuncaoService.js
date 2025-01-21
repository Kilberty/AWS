const db = require('../../database/database');

const excluirFuncao = async (target,id,user) => {
  
  try{
  const con = await db.conectar(target,user);
  const query = 'DELETE FROM Funcoes where id = ?';
  await con.execute(query,[id]);
  await con.end();
  
  return{
    statusCode:200,
    message:"Função excluida com sucesso!" 
  }}
  
  catch(error){
     return{
        statusCode:500,
        message: error.message
     }
  }

};

module.exports = { excluirFuncao };