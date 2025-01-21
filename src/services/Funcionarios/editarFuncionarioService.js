const db = require('../../database/database');

const aliasCampos = {
    codigoPonto: 'Codigo',
    nome: 'Nome',
    dataAdmissao: 'data_admissao',
    dataDemissao: 'data_demissao',
    cep: 'cep',
    endereco: 'endereco',
    bairro: 'bairro',
    numeroEndereco: 'numero_endereco',
    cidade: 'cidade',
    uf: 'uf',
    complemento: 'complemento_endereco',
    cpf: 'cpf',
    esocial: 'esocial',
    rg: 'rg',
    orgaoEmissor: 'orgao_emissor',
    ufRG: 'uf_rg',
    emissaoRG: 'data_emissao_rg',
    pis: 'pis_pasep',
    ctps: 'ctps',
    serie: 'serie_ctps',
    nomePai: 'nome_pai',
    nomeMae: 'nome_mae',
    ufNasc: 'uf_nascimento',
    cidadeNasc: 'municipio_nascimento',
    dataNascimento: 'data_nascimento',
    funcao: 'Funcao',
    diasJornada: 'DiasJornada',
    horas: 'Horas'
};

const editarFuncionarios = async (target, dados, id, user) => {
  try {
    // Verificar se o campo diasJornada está presente e convertê-lo para uma string JSON
    if (dados.diasJornada) {
      dados.diasJornada = JSON.stringify(dados.diasJornada);
    }

    // Mapear os campos com base nos aliasCampos
    const campos = Object.keys(dados).map(alias => aliasCampos[alias]);
    const valores = Object.values(dados);

    // Verificar se existem campos para atualizar
    if (campos.length === 0) {
      return { message: 'Nenhum campo válido para atualização' };
    }

    // Construir a query de atualização
    const query = `
      UPDATE Funcionarios
      SET ${campos.map((campo) => `${campo} = ?`).join(', ')}
      WHERE id = ?
    `;

    // Adicionar o ID ao final dos valores para a cláusula WHERE
    valores.push(id);

    // Conectar ao banco de dados e executar a query
    const con = await db.conectar(target, user);
    await con.execute(query, valores);
    await con.end();

    return {
      statusCode: 200,
      message: 'Dados atualizados com sucesso!'
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message
    };
  }
};

module.exports = { editarFuncionarios };
