const db = require("../../database/users")


const cadastraUsuario = async (empresaID,user,target,nomeEmpresa,desativado)=>{
 const con = await db.conectarUsuario()
 try{
         
  const query = "INSERT INTO Usuarios(empresa_id,user,target,nomeEmpresa,desativado) VALUES (?,?,?,?,?)" 
  await con.execute(query,[empresaID,user,target,nomeEmpresa,desativado])
  return{
    statusCode:200,
    message:"Usuario cadastrado com sucesso"
  }


 }catch(error){
  return{
    statusCode:500,
    message:"Erro ao cadastrar usuário"
  } 
 }finally{
  con.end()
 }
 
}


const checarUsuario = async (empresaID, user, target, nomeEmpresa, desativado) => {
  const con = await db.conectarUsuario();
  try {
    const query = "SELECT * FROM Usuarios WHERE user = ? AND empresa_id = ?";
    const [rows] = await con.execute(query, [user, empresaID]); // Use rows para obter os resultados

    if (rows.length > 0) { // Verifica o número real de registros retornados
      return {
        statusCode: 500,
        message: "Email já utilizado",
      };
    } else {
      const cadastrar = await cadastraUsuario(empresaID, user, target, nomeEmpresa, desativado);
      return {
        statusCode: cadastrar.statusCode,
        message: cadastrar.message,
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: "Erro ao cadastrar usuário: " + error.message,
    };
  } finally {
    con.end();
  }
};





module.exports = { checarUsuario }