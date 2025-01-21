const express = require('express');
const login = require('../../services/Usuarios/loginService');
const serverless = require('serverless-http');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(express.json());

const corsOptions = {
  origin: "*", // A URL do seu frontend deve estar aqui
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Headers permitidos
  optionsSuccessStatus: 200, // Status para respostas OPTIONS
  credentials: true, // Permite o envio de cookies
};

// Aplica o CORS globalmente
app.use(cors(corsOptions));

app.post('/User/loginPonto', async (req, res) => {
  try {
    const { user, pwd } = req.body;
    const result = await login.autenticar(user, pwd);
    const idToken = result?.AuthenticationResult?.IdToken;
    const accessToken = result?.AuthenticationResult?.AccessToken;
    const decode = jwt.decode(idToken);
    const user_database = decode['custom:user_database'];
    const database = decode['custom:database'];

    // Configurando os cookies
    res.cookie('AccessToken', accessToken, {
      secure: false, // Mude para true em produção com HTTPS
      httpOnly: true, // Impede o acesso ao cookie via JavaScript
      path: '/',
      sameSite: 'None', // Se estiver usando cookies em diferentes domínios
      maxAge: 36000000, // 10 horas
    });

    res.cookie('target', database, {
      secure: false, // Mude para true em produção com HTTPS
      httpOnly: true,
      path: '/',
      sameSite: 'None',
      maxAge: 36000000,
    });

    res.cookie('id', user_database, {
      secure: false, // Mude para true em produção com HTTPS
      httpOnly: true,
      path: '/',
      sameSite: 'None',
      maxAge: 36000000,
    });

    // Retorna a resposta
    return res.status(200).json({
      message: "Usuário autenticado com sucesso!",
      idtoken: idToken ,
      jwt: accessToken,
      target: database,
      id: user_database
    });
  } catch (error) {
    return res.status(500).json({ message: 'Usuário ou Senha incorretos', error: error.message });
  }
});

module.exports.handler = serverless(app);
