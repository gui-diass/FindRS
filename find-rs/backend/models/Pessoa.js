const mongoose = require('mongoose');

const pessoaSchema = new mongoose.Schema({
  nome: String,
  foto: String, // caminho da imagem
  abrigoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Abrigo',
  },
}, { timestamps: true });

module.exports = mongoose.model('Pessoa', pessoaSchema);
