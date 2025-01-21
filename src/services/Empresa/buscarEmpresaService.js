const db = require('../../database/database');

const empresaInfo = async (target,user) => {
  const con = await db.conectar(target,user);
  const query = 'select * from Empresas';
  const [rows] = await con.execute(query);
  const empresa = rows[0]
  await con.end();
  
  return {
    id: empresa.id,
    razaoSocial: empresa.RazaoSocial,
    nomeFantasia: empresa.NomeFantasia,
    cep: empresa.CEP,
    cnpj: empresa.CNPJ,
    inscricaoEstadual: empresa.InscricaoEstadual,
    telefone1: empresa.Telefone1,
    telefone2: empresa.Telefone2,
    cidade: empresa.Cidade,
    endereco: empresa.Endereco,
    uf: empresa.UF,
    numero: empresa.Numero,
    bairro: empresa.Bairro,
    email: empresa.Email,
    desativada: empresa.Desativada
  };
};

module.exports = {empresaInfo};