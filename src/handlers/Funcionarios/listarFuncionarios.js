const cors = require('cors');
const listar = require('../../services/Funcionarios/listarFuncionariosService');
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

app.get('/Funcionarios/Filtrar', async (req, res) => {
  try {
    const { target, nome = null, codigoFuncionario = null, cpf = null, funcao = null,page=1,limit=10,user,ord} = req.query;
    
    
    
    const result = await listar.listarFuncionarios(target,nome,codigoFuncionario,cpf,funcao,page,limit,user,ord);

    return res.status(200).json({
      data: result.data, // Lista de funcionários
      totalRecords: result.totalRecords, // Total de registros
      totalPages: result.totalPages, // Total de páginas
      currentPage: result.currentPage, // Página atual
      pageSize: result.pageSize // Tamanho da página
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar funções', error: error.message });
  }
});

module.exports.handler = serverless(app);
