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

app.patch('/Ponto/AjustarHorario', async (req, res) => {
  try {
    const {
        idOperacao,
        target,
        ajuste,
        justificativa,
        idPonto

    } = req.body
   
    if(idOperacao == 4){
        const result = await ponto.ajustarPonto(target,idPonto,ajuste,justificativa)     
        return res.status(result.statusCode).json({
            message:result.message,
            HorarioInicio: result.HoraInicio,
            HorarioAlmoco: result.HoraAlmoco,
            HorarioRetorno:result.HoraRetorno,
            HorarioFim: result.HoraFim
        })
     }else{
        return res.status(500).json({
            message:"Operação Inválida" 
         })
    }

} catch (error) {
    return res.status(500).json({ message: 'Erro ao iniciar ajuste de ponto', error: error.message });
  }
});

module.exports.handler = serverless(app);
