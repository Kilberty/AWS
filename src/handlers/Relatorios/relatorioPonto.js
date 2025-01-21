const cors = require('cors');
const relatorioInfo = require('../../services/Relatorios/relatorioPontoService');
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




app.get('/Relatorio/Ponto', async (req, res) => {
  try {
    
    const {id,target,user} = req.query
    
    const result = await relatorioInfo.relatorio(id,target,user)
   
 
    return res.status(result.statusCode).json({    
         empresa:result.dadosEmpresa,
         funcionario: result.dadosFuncionario  
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar funções', error: error.message });
  }
});

module.exports.handler = serverless(app);