const cors = require('cors');
const cadastrar = require('../../services/Funcionarios/cadastrarFuncionariosService');
const serverless = require('serverless-http');
const express = require('express');

const app = express();

const corsOptions = {
  origin: process.env.ORIGIN, // Permite qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Headers permitidos
  optionsSuccessStatus: 200 // Status para respostas OPTIONS
};
  
  // Aplica o CORS globalmente
  app.use(cors(corsOptions));
  app.use(express.json());



app.post('/Funcionarios/Cadastrar', async (req, res) => {
  try {
    
    const { 
        target = null, // Define um valor padrão
        codigoPonto = null,
        nome = null,
        dataAdmissao = null,
        dataDemissao = null,
        cep = null,
        endereco = null,
        bairro = null,
        numeroEndereco = null,
        cidade = null,
        uf = null,
        complemento = null,
        cpf = null,
        esocial = null,
        rg = null,
        orgaoEmissor = null,
        ufRG = null,
        emissaoRG = null,
        pis = null,
        ctps = null,
        serie = null,
        nomePai = null,
        nomeMae = null,
        ufNasc = null,
        cidadeNasc = null,
        dataNascimento = null,
        Funcao = null,
        user 
      } = req.body;
    
      
    
    
 result =  await cadastrar.cadastrarFuncionario({
        target,codigoPonto, nome, dataAdmissao, dataDemissao, cep, endereco,
        bairro, numeroEndereco, cidade, uf, complemento, cpf, esocial, rg, orgaoEmissor,
        ufRG, emissaoRG, pis, ctps, serie, nomePai, nomeMae, ufNasc, cidadeNasc, dataNascimento,
        Funcao
      },user);
   
 
    return res.status(200).json({ message: result.message });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao adicionar funcionário', error: error.message });
  }
});

module.exports.handler = serverless(app);