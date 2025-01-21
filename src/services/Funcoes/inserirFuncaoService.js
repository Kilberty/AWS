const db = require('../../database/database');

const inserirFuncao = async (target,funcao,diasSemana,HorasSemanais,user,descricao) => {
  
  try{
  const con = await db.conectar(target,user);
  const jsonDiasSemana = JSON.stringify(diasSemana);
  const query = 'INSERT INTO Funcoes(Descricao,DiasJornada,HorasSemanais,Detalhes) VALUES (?,?,?,?) ';
  await con.execute(query,[funcao,jsonDiasSemana,HorasSemanais,descricao]);
  await con.end();
  
  return{
    statusCode:200,
    message:"Função cadastrada com sucesso!" 
  }}
  
  catch(error){
     return{
        statusCode:500,
        message: error.message
     }
  }

};

module.exports = { inserirFuncao };