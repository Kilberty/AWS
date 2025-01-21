const express = require('express');
const login = require('../../services/Usuarios/loginService');
const serverless = require('serverless-http');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(express.json());

const corsOptions = {
  origin: process.env.ORIGIN, // A URL do seu frontend deve estar aqui
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Headers permitidos
  optionsSuccessStatus: 200, // Status para respostas OPTIONS
  credentials: true, // Permite o envio de cookies
};

// Aplica o CORS globalmente
app.use(cors(corsOptions)); 

app.post('/User/logout', async (req, res) => {
    const { Token } = req.body; // Receba o AccessToken no corpo da requisição
    try {
      const response = await logout(Token);
      res.status(response.status).send(response);
    } catch (error) {
      res.status(error.status || 500).send({ message: error.message });
    }
  });
  

  module.exports.handler = serverless(app);