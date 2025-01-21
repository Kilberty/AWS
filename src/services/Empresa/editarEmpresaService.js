const db = require('../../database/database');

const aliasCampos = {
    nomeFantasia: 'NomeFantasia',
    razaoSocial: 'RazaoSocial',
    cep: 'CEP',
    cnpj: 'CNPJ',
    inscricaoEstadual: 'InscricaoEstadual',
    telefone1: 'Telefone1',
    telefone2: 'Telefone2',
    cidade: 'Cidade',
    endereco: 'Endereco',
    uf: 'UF',
    numero: 'Numero',
    bairro: 'Bairro',
    email: 'Email',
    desativada1: 'Desativada'
}

const editarEmpresa = async (target,dados,id,user) => {
  try{  
    const campos = Object.keys(dados).map(alias=>aliasCampos[alias]) 
    const valores = Object.values(dados); 
    
    if(campos.length == 0){
        return{message:'Nenhum campo válido para atualização'}
    }
    
    const query =  `
      UPDATE Empresas
      SET ${campos.map((campo) => `${campo} = ?`).join(', ')}
      WHERE id = ?
    
    `
    valores.push(id)  
    const con = await db.conectar(target,user);
    await con.execute(query,valores)
    await con.end()
    return {
        statusCode:200,
        message:'Dados atualizados com sucesso!'
    }
  }catch(error){
     return{
        statusCode:500,
        message:error.message
     }
  }

};

module.exports = { editarEmpresa }