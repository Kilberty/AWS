const cors = require('cors');
const ponto = require('../../services/Ponto/baterPontoFacialService');
const serverless = require('serverless-http');
const express = require('express');

const app = express();
app.use(express.json());
const corsOptions = {
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.post('/Ponto/RegistrarFacial', async (req, res) => {
  try {
    const target = req.body.target;
    const data = req.body.data
    const empresaID = req.body.empresaID
    
    const result = await ponto.baterPonto(target,data,empresaID)

    return res.status(result.statusCode).json({
        id: result.id,
        Codigo: result.Codigo,
        Nome: result.Nome,
        Data: result.Data,
        Hora: result.Hora,
        message: result.message
 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao trazer horário de ponto', error: error.message });
  }
});

module.exports.handler = serverless(app);
