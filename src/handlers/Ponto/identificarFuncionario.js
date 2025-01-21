const cors = require('cors');
const ponto = require('../../services/Ponto/idFuncionarioCodigo');
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




app.get('/Ponto/Identificar', async (req, res) => {
  try {
    const {codigoPonto,target,user} = req.query
    
    const result = await ponto.identificaFuncionario(codigoPonto,target,user)
    return res.status(result.statusCode).json({ 
       message: result.message,
       data: result.data,
      });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar funções', error: error.message });
  }
});

module.exports.handler = serverless(app);