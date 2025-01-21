const db = require('../../database/database')

const identificaFuncionario =  async  (codigoPonto,target,user) =>{
try{
    const con = await db.conectar(target,user);
    
    const [funcionarios] = await con.query(
        'SELECT Codigo,id,Nome FROM Funcionarios WHERE Codigo = ?',
        [codigoPonto]
    );

    const funcionario = funcionarios[0];
    if(!funcionario){
        return{
            statusCode:404,
            message: "Funcionário não encontrado"
        }
    }
    con.end()
    return{
        statusCode:200,
        message: "Funcionário Encontrado",
        data: funcionario
    }



}catch(error){

  return{
    statusCode:500,
    message:"Erro ao buscar funcionário "+error.message,

  }



} 
    
}


module.exports = {identificaFuncionario}