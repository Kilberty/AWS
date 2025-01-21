const cors = require('cors');
const funcoesService = require('../../services/Funcoes/idFuncaoService');
const serverless = require('serverless-http');
const express = require('express');


const app = express();

const corsOptions = {
  origin: process.env.ORIGIN, // Permite qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH','OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Headers permitidos
  credentials:true,
  optionsSuccessStatus: 200 // Status para respostas OPTIONS
};
  

  app.use(cors(corsOptions));
  app.use(express.json());



app.get('/Funcoes/Info', async (req, res) => {
  try {
    const {target,dados,id,user} = req.query
    const result = await funcoesService.idFuncao(target,id,user)
    return res.status(result.statusCode).json({data: result.data[0]});
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar Funcao', error: error.message });
  }
});

module.exports.handler = serverless(app);