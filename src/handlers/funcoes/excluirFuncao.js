const cors = require('cors');
const funcoesService = require('../../services/Funcoes/excluirFuncaoService');
const serverless = require('serverless-http');
const express = require('express');


const app = express();




const corsOptions = {
  origin: process.env.ORIGIN, // Permite qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Headers permitidos
  credentials:true,
  optionsSuccessStatus: 200 // Status para respostas OPTIONS
};
  

  app.use(cors(corsOptions));
  app.use(express.json());



app.delete('/Funcoes/Excluir', async (req, res) => {
  try {
    const {target,id,user} = req.body
    const result = await funcoesService.excluirFuncao(target,id,user)

    return res.status(result.statusCode).json({message: result.message});
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar funções', error: error.message });
  }
});

module.exports.handler = serverless(app);