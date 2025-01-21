const db  = require('../../database/users')

const usuarioEmpresas = async (username) => {
  const con = await db.conectarUsuario();
  try {
    const query = "SELECT * FROM Usuarios where user = ?";
    const [result] = await con.execute(query, [username]);

    if (result && result.length > 0) {
      // Retorna os dados juntamente com statusCode e message
      return {
        statusCode: 200,
        message: "Empresas encontradas",
        data: result.map(row => ({
          empresa: row.nomeEmpresa,
          idEmpresa: row.empresa_id,
          secret: row.secret,
          target: row.target,
          user: row.db_username
        }))
      };
    } else {
      // Retorna status 404 caso não tenha dados
      return {
        statusCode: 404,
        message: "Usuário sem empresa vinculada",
        data: []
      };
    }
  } catch (error) {
    // Caso haja erro na execução
    return {
      statusCode: 500,
      message: "Erro ao buscar empresas: " + error.message,
      data: []
    };
  }
};

module.exports = { usuarioEmpresas };
