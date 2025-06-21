const bcrypt = require('bcryptjs');
const Abrigo = require('../models/Abrigo');
const Pessoa = require('../models/Pessoa');
const fs = require('fs');
const path = require('path');

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
    const abrigoId = req.params.id;

    // Verificar se o abrigo existe
    const abrigo = await Abrigo.findById(abrigoId);
    if (!abrigo) {
      return res.status(404).json({ error: 'Abrigo não encontrado.' });
    }

    // Verificar se ainda existem pessoas vinculadas ao abrigo
    const pessoas = await Pessoa.find({ abrigoId });
    if (pessoas.length > 0) {
      return res.status(400).json({ error: 'Exclua todas as pessoas antes de deletar o abrigo.' });
    }

    // Excluir o abrigo
    await Abrigo.findByIdAndDelete(abrigoId);

    res.status(200).json({ message: 'Abrigo excluído com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir abrigo:', err);
    res.status(500).json({ error: 'Erro interno ao excluir abrigo.' });
  }
};
