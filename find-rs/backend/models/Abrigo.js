const mongoose = require('mongoose');

const abrigoSchema = new mongoose.Schema({
  nome: String,
  cidade: String,
  bairro: String,
  rua: String,
  numero: String,
  email: {
    type: String,
    required: true,
    unique: true, // 👈 isso impede duplicatas
  },
  senha: String, // por enquanto sem criptografia
}, { timestamps: true });

module.exports = mongoose.model('Abrigo', abrigoSchema);
