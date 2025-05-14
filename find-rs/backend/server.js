const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Importar rotas
const abrigoRoutes = require('./routes/abrigoRoutes');
app.use('/api/abrigos', abrigoRoutes);

// Conectar ao MongoDB e iniciar o servidor
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(5000, () => console.log('Servidor rodando na porta 5000'));
  })
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));
