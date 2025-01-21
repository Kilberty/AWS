const express = require('express');
const empresa = require('../../services/Usuarios/usuarioEmpresaService');
const serverless = require('serverless-http');
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

app.post('/User/Email', async (req, res) => {
  try {
    const {empresaID,user,target,nomeEmpresa,desativado,dbUser} = req.body
    const result = await empresa.checarUsuario(empresaID,user,target,nomeEmpresa,desativado,dbUser)
    return res.status(result.statusCode).json({
        message: result.message,
        data: result.data

    });
  } catch (error) {
    return res.status(500).json({ message: 'Usuário ou Senha incorretos', error: error.message });
  }
});

module.exports.handler = serverless(app);
