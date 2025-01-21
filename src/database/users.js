const mysql = require('mysql2/promise');

const conectarUsuario = async () => {
    const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: "u945487164_Login",
    password: process.env.DB_PWD,
    database: "u945487164_Login" ,
  });
  return connection;
};

module.exports = { conectarUsuario };