const mysql = require('mysql2/promise');

const conectar = async (target,user) => {
  const database = "u945487164_"+target;
  const usuario =  "u945487164_"+user
    const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: usuario,
    password: process.env.DB_PWD,
    database: database,
  });
  return connection;
};

module.exports = { conectar };