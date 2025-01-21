const cors = require('cors');
const funcionariosService = require('../../services/Funcionarios/autocompleteFuncionarios');
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




app.get('/Funcionarios/Listar', async (req, res) => {
  try {
    const result = await funcionariosService.autocompleteFuncionarios(req.query.target,req.query.user)
   
 
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar funções', error: error.message });
  }
});

module.exports.handler = serverless(app);