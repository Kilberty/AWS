const cors = require('cors');
const funcionariosService = require('../../services/Funcionarios/editarFuncionarioService');
const serverless = require('serverless-http');
const express = require('express');

const app = express();

const corsOptions = {
  origin: process.env.ORIGIN, // Permite qualquer origem
  methods: ['GET', 'POST', 'PUT','PATCH','DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Headers permitidos
  optionsSuccessStatus: 200 // Status para respostas OPTIONS
};
  
  // Aplica o CORS globalmente
  app.use(cors(corsOptions));
  app.use(express.json());




app.patch('/Funcionarios/:id/editar', async (req, res) => {
  try {
    const {id} = req.params
    const {dadosFuncionario,target,user} = req.body
    const result =   await funcionariosService.editarFuncionarios(target,dadosFuncionario,id,user)
 
 
    return res.status(result.statusCode).json({ message: result.message });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao editar Funcionário', error: error.message });
  }
});

module.exports.handler = serverless(app);