const db = require('../../database/database');

const deletar = async (target,id,user) => {
 
 try{
    const con = await db.conectar(target,user);
    const query = 'DELETE FROM Funcionarios where id = ?';
    await con.execute(query,[id])
    await con.end();
    
    return {
      statusCode:200,  
      message:"Usuário deletado com sucesso"
    }
 }catch(error){
   return{
    statusCode:500,
    message:error
  }
 }
  
};

module.exports = {deletar};