const cors = require('cors');
const ponto = require('../../services/Ponto/consultaPontoService');
const serverless = require('serverless-http');
const express = require('express');

const app = express();

const corsOptions = {
  origin: process.env.ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.get('/Ponto/Buscar', async (req, res) => {
  try {
    const DataInicio = req.query.DataInicio;
    const target = req.query.target;
    const EmployeeId = req.query.EmployeeId;
    const DataFim = req.query.DataFim
    const user = req.query.user
    
    const result = await ponto.buscarPonto(DataInicio,DataFim,EmployeeId,target,user);

    return res.status(200).json({
        message: result.message,
        BancoHoras: result.bancoHoras,
        HorasTrabalhadas:result.Trabalhado, 
        data: result.data,
        
     
 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao trazer horário de ponto', error: error.message });
  }
});

module.exports.handler = serverless(app);
