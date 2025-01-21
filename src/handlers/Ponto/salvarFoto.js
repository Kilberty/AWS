const express = require('express');
const cors = require('cors');
const multer = require('multer');
const salvarService = require('../../services/Ponto/salvarFotoService');
const serverless = require('serverless-http');

const app = express();

// Configuração do multer para lidar com o upload de imagens
const upload = multer({ storage: multer.memoryStorage() });

// Configuração do CORS
const corsOptions = {
  origin: process.env.ORIGIN, // Permite qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Rota que recebe o arquivo de imagem
app.post('/Ponto/SalvarFoto', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem foi enviada.' });
    }

    const { target, id } = req.body;  // Obtém os parâmetros do corpo da requisição
    const file = req.file;  // O arquivo enviado

    const result = await salvarService.salvarImagem(id, target, file);

    return res.status(result.statusCode).json({
      message: result.message,
      url: result.uploadURL,
      
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar foto', error: error.message });
  }
});
// Expondo a função para o Serverless (AWS Lambda)
module.exports.handler = serverless(app);
