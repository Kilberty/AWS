const cors = require('cors');
const cadastrar = require('../../services/Usuarios/registroService')
const serverless = require('serverless-http');
const express = require('express');

const app = express();
app.use(express.json())
/*const corsOptions = {
  origin: '*', // Permite qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Headers permitidos
  optionsSuccessStatus: 200 // Status para respostas OPTIONS
};
  
  // Aplica o CORS globalmente
  app.use(cors(corsOptions));*/
   
  app.post('/User/Add', async (req, res) => {
  try {
    const {user,target,pwd,userDB} = req.body
    const result =  await cadastrar.registrar(user,pwd,userDB,target)
    
    return res.status(200).json({ message: result });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar funções', error: error.message });
  }
});

module.exports.handler = serverless(app);