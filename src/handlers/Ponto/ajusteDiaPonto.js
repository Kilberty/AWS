const cors = require('cors');
const ponto = require('../../services/Ponto/ajustePontoService');
const serverless = require('serverless-http');
const express = require('express');

const app = express();
app.use(express.json());
const corsOptions = {
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.post('/Ponto/AjustarDia', async (req, res) => {
  try {
    const {
        idOperacao = null,
        datas = null,
        target = null,
        idFuncionario = null,
        justificativa=null,
        user = null,

    } = req.body
    let result = null
    
    switch (Number(idOperacao)) {
      case 1:
      case 2:
      case 3:
      case 5:  
        result = await ponto.inserirPonto(target, Number(idOperacao), datas, idFuncionario, justificativa,user);
        break; 
      default:
        return res.status(400).json({
          message: "Operação Inválida"
        });
    }



    return res.status(result.statusCode).json({
      message:result.message
 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao iniciar ajuste de ponto', error: error.message });
  }
});

module.exports.handler = serverless(app);
