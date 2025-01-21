const cors = require('cors');
const idService = require('../../services/Funcionarios/idFuncionariosService');
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

app.get('/Funcionarios/:id/editar', async (req, res) => {
  try {
    const result = await idService.idFunc(req.query.target, req.params.id,req.query.user);

    return res.status(200).json({ data: result.data });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar funções', error: error.message });
  }
});


module.exports.handler = serverless(app);
