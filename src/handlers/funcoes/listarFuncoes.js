const cors = require('cors');
const funcoesService = require('../../services/Funcoes/listarFuncoesService');
const serverless = require('serverless-http');
const express = require('express');



const app = express();



const corsOptions = {
  origin: process.env.ORIGIN, // Permite qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Headers permitidos
  credentials:true,
  optionsSuccessStatus: [200,401,403,500] // Status para respostas OPTIONS
};
  
  // Aplica o CORS globalmente
  app.use(cors(corsOptions));
  app.use(express.json())



app.get('/Funcoes/Listar', async (req, res) => {
  try {
    const {target,user,funcao} = req.query
    const result = await funcoesService.getFuncoes(target,user,funcao);

    return res.status(200).json({ data: result.data });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar funções', error: error.message });
  }
});

module.exports.handler = serverless(app);