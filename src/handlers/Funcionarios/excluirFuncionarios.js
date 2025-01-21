const cors = require('cors');
const deletar = require('../../services/Funcionarios/excluirFuncionariosService');
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

app.delete('/Funcionarios/:id/excluir', async (req, res) => {
  try {
    const result = await deletar.deletar(req.query.target, req.params.id,req.query.user);

    return res.status(result.statusCode).json({ message: result.message});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


module.exports.handler = serverless(app);
