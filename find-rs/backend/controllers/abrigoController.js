const bcrypt = require('bcryptjs');
const Abrigo = require('../models/Abrigo');

exports.criarAbrigo = async (req, res) => {
  try {
    const { senha, ...resto } = req.body;

    const hash = await bcrypt.hash(senha, 10); // ← criptografa a senha
    const novoAbrigo = new Abrigo({ ...resto, senha: hash });

    const salvo = await novoAbrigo.save();
    console.log('Abrigo salvo:', salvo);
    res.status(201).json(salvo);
  } catch (err) {
    console.error('Erro ao salvar abrigo:', err);
    res.status(500).json({ error: 'Erro ao salvar abrigo' });
  }
};



exports.listarAbrigos = async (req, res) => {
  try {
    const abrigos = await Abrigo.find().sort({ createdAt: -1 });
    res.json(abrigos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar abrigos' });
  }
};

exports.deletarAbrigo = async (req, res) => {
  try {
    await Abrigo.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar abrigo' });
  }
};

