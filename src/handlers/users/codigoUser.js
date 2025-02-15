const express = require('express');
const codigo = require('../../services/Usuarios/codigoUserService')
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();

app.use(express.json());

const corsOptions = {
  origin: '*', // Permite qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Headers permitidos
  optionsSuccessStatus: 200 // Status para respostas OPTIONS
};
  
  // Aplica o CORS globalmente
  app.use(cors(corsOptions));


app.post('/User/Validar', async (req, res) => {
  const { user, code } = req.body;
  
try {
    await codigo.validar(user,code)
    return res.status(200).json({ message: 'Usuário confirmado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao confirmar o usuário', error: error.message });
  }
});

module.exports.handler = serverless(app);
