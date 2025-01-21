const express = require('express');
const codigo = require('../../services/Usuarios/codigoUserService')
const serverless = require('serverless-http');
const app = express();

app.use(express.json());

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
