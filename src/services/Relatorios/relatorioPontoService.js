const db = require('../../database/database');

const infoFuncionario = async (target, id,user) => {
    const database = target;
    const idFuncao = id;
    
    // Conecta ao banco de dados
    const con = await db.conectar(database,user);
    
    // Consulta SQL
    const query = ` SELECT f.id, f.Nome, f.cpf, fu.Descricao AS DescricaoFuncao
          FROM Funcionarios f
          JOIN Funcoes fu ON f.Funcao = fu.id  WHERE f.id = ? `;
      
      
    const [rows] = await con.execute(query, [idFuncao]);
    
    const result = rows.map(row => ({
        id: row.id,
        funcao: row.DescricaoFuncao,
        cpf: row.cpf,
        nome: row.Nome

    }));

    // Fecha a conexão
    await con.end();

    // Retorna o resultado
    return {
        statusCode: 200,
        data:result[0]
    };
};

const infoEmpresa = async(target,user) =>{
    const database = target;
    
    // Conecta ao banco de dados
    const con = await db.conectar(database,user);
    
    // Consulta SQL
    const query = `SELECT * FROM Empresas`;
      
      
    const [rows] = await con.execute(query);
    
    const result = rows.map(row => ({
      razao: row.RazaoSocial,
      fantasia: row.NomeFantasia,
      cep: row.CEP,
      cnpj: row.CNPJ,
      cidade: row.Cidade,
      bairro: row.Bairro,
      numero: row.Numero,
      endereco: row.Endereco,
      uf: row.UF

    }));

    // Fecha a conexão
    await con.end();

    // Retorna o resultado
    return {
        statusCode: 200,
        data:result[0]
    };
}



const relatorio = async (id,target,user) =>{
    
    const funcionario = await infoFuncionario(target,id,user)
    if(!funcionario){
        return{
            statusCode:404,
            message: "Funcionario não encontrado"
        }
    }
    
    const empresa = await infoEmpresa(target,user)
    return{
        statusCode:200,
        dadosFuncionario: funcionario,
        dadosEmpresa: empresa
    }
}










module.exports = { relatorio };
