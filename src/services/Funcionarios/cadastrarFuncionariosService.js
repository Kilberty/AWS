const db = require('../../database/database');

const cadastrarFuncionario = async (data,user) => {
  try {
    const { 
        target,
        codigoPonto,
        nome,
        dataAdmissao,
        dataDemissao,
        cep,
        endereco,
        bairro,
        numeroEndereco,
        cidade,
        uf,
        complemento,
        cpf,
        esocial,
        rg,
        orgaoEmissor,
        ufRG,
        emissaoRG,
        pis,
        ctps,
        serie,
        nomePai,
        nomeMae,
        ufNasc,
        cidadeNasc,
        dataNascimento,
        Funcao 
      } = data;

    const con = await db.conectar(target,user);

    // 1. Verifique se o funcionário já existe
    const checkQuery = 'SELECT COUNT(*) AS count FROM Funcionarios WHERE Nome = ?';
    const [rows] = await con.execute(checkQuery, [nome]);
    const count = rows[0].count;

    if (count > 0) {
      await con.end();
      return {
        statusCode: 400, // Bad Request
        message: 'Já existe um funcionário cadastrado com esse nome.' 
      };
    }

    // 2. Insira o novo funcionário se não existir
    const query = `
      INSERT INTO Funcionarios (
        Codigo, Nome, data_admissao, data_demissao, cep, endereco, bairro,
        numero_endereco, cidade, uf, complemento_endereco, cpf, esocial, rg, orgao_emissor,
        uf_rg, data_emissao_rg, pis_pasep, ctps, serie_ctps, nome_pai, nome_mae, uf_nascimento, municipio_nascimento, data_nascimento, Funcao
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `;

    await con.execute(query, [
      codigoPonto, nome, dataAdmissao, dataDemissao, cep, endereco, bairro, numeroEndereco, cidade, uf, complemento, cpf, esocial,
      rg, orgaoEmissor, ufRG, emissaoRG, pis, ctps, serie, nomePai, nomeMae, ufNasc, cidadeNasc, dataNascimento, Funcao
    ]);

    await con.end();
    return {
      statusCode: 200,
      mensagem: "Funcionário cadastrado com sucesso!"
    };

  } catch (error) {
    return {
      statusCode: 500,
      message: 'Erro ao processar a requisição', error: error.message 
    };
  }
};

module.exports = { cadastrarFuncionario };
