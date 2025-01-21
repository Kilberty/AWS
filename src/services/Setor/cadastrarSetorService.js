const db = require('../../database/database');

const cadastrarSetor = async (target,setor) => {
  
  try{
  const con = await db.conectar(target);
  const query = 'INSERT INTO Setor(Descricao) VALUES (?) ';
  await con.execute(query,[setor]);
  await con.end();
  
  return{
    statusCode:200,
    message:"Setor cadastrado com sucesso!" 
  }}
  
  catch(error){
     return{
        statusCode:500,
        message: error.message
     }
  }

};

module.exports = { cadastrarSetor };