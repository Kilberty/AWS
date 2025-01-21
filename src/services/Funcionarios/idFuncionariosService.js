const db = require('../../database/database');

const idFunc = async (target, id,user) => {
    const database = target;
    const idFuncionario = id;
    
    // Conecta ao banco de dados
    const con = await db.conectar(database,user);
    
    // Consulta SQL
    const query = `SELECT id, Codigo, Nome, data_admissao, data_demissao, cep, endereco, bairro,
        numero_endereco, cidade, uf, complemento_endereco, cpf, esocial, rg, orgao_emissor,
        uf_rg, data_emissao_rg, pis_pasep, ctps, serie_ctps, nome_pai, nome_mae, uf_nascimento,
        municipio_nascimento, data_nascimento,Funcao,DiasJornada,Horas 
        FROM Funcionarios WHERE id = ?`;

    // Executa a consulta
    const [rows] = await con.execute(query, [idFuncionario]);

    // Mapeia os resultados
    const result = rows.map(row => ({
        id: row.id,
        nome: row.Nome,
        codigo: row.Codigo,
        dataAdmissao: row.data_admissao,
        dataDemissao: row.data_demissao,
        cep: row.cep,
        endereco: row.endereco,
        bairro: row.bairro,
        numeroEndereco: row.numero_endereco,
        cidade: row.cidade,
        uf: row.uf,
        complemento: row.complemento_endereco,
        cpf: row.cpf,
        esocial: row.esocial,
        rg: row.rg,
        orgaoEmissor: row.orgao_emissor,
        ufRg: row.uf_rg,
        dataEmissaoRg: row.data_emissao_rg,
        pisPasep: row.pis_pasep,
        ctps: row.ctps,
        serieCtps: row.serie_ctps,
        nomePai: row.nome_pai,
        nomeMae: row.nome_mae,
        ufNasc: row.uf_nascimento,
        nascimentoMunicipio: row.municipio_nascimento,
        dataNascimento: row.data_nascimento,
        funcao: row.Funcao,
       // diasJornada: JSON.parse(row.DiasJornada),
        horas: row.Horas
    }));

    // Fecha a conexão
    await con.end();

    // Retorna o resultado
    return {
        statusCode: 200,
        data:result
    };
};

module.exports = { idFunc };
