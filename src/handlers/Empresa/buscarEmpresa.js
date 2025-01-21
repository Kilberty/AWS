const cors = require('cors');
const empresaService = require('../../services/Empresa/buscarEmpresaService');
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




app.get('/Empresa/Info', async (req, res) => {
  try {
    const result = await empresaService.empresaInfo(req.query.target,req.query.user)
   
 
    return res.status(200).json({    
        id: result.id,
        razaoSocial: result.razaoSocial,
        nomeFantasia: result.nomeFantasia,
        cep: result.cep,
        cnpj: result.cnpj,
        inscricaoEstadual: result.inscricaoEstadual,
        telefone1: result.telefone1,
        telefone2: result.telefone2,
        cidade: result.cidade,
        endereco: result.endereco,
        uf: result.uf,
        numero: result.numero,
        bairro: result.bairro,
        email: result.email,
        desativada: result.desativada 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar funções', error: error.message });
  }
});

module.exports.handler = serverless(app);