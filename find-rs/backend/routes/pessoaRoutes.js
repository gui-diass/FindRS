const express = require('express');
const router = express.Router();
const Pessoa = require('../models/Pessoa');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configuração do multer para upload de fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Cadastrar pessoa com foto
router.post('/', upload.single('foto'), async (req, res) => {
  try {
    const { nome, abrigoId } = req.body;
    const novaPessoa = new Pessoa({
      nome,
      foto: req.file.filename,
      abrigoId,
    });
    await novaPessoa.save();
    res.status(201).json(novaPessoa);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar pessoa' });
  }
});

// Listar pessoas por abrigo
router.get('/', async (req, res) => {
  try {
    const { abrigoId } = req.query;
    const pessoas = await Pessoa.find({ abrigoId });
    res.json(pessoas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pessoas' });
  }
});

// ⚠️ IMPORTANTE: rota de deletar todas as pessoas vem ANTES da rota /:id

// Excluir todas as pessoas de um abrigo
router.delete('/todas/:abrigoId', async (req, res) => {
  try {
    const { abrigoId } = req.params;
    const pessoas = await Pessoa.find({ abrigoId });

    for (const pessoa of pessoas) {
      const caminhoImagem = path.join(__dirname, '..', 'uploads', pessoa.foto);
      if (fs.existsSync(caminhoImagem)) {
        fs.unlinkSync(caminhoImagem); // Remove a imagem
      }
      await Pessoa.findByIdAndDelete(pessoa._id); // Remove do banco
    }

    res.status(200).json({ message: 'Todas as pessoas foram excluídas com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir todas as pessoas:', err);
    res.status(500).json({ error: 'Erro ao excluir todas as pessoas.' });
  }
});

// Excluir uma pessoa
router.delete('/:id', async (req, res) => {
  try {
    const pessoa = await Pessoa.findById(req.params.id);
    if (!pessoa) return res.status(404).json({ error: 'Pessoa não encontrada' });

    const caminhoImagem = path.join(__dirname, '..', 'uploads', pessoa.foto);
    if (fs.existsSync(caminhoImagem)) {
      fs.unlinkSync(caminhoImagem);
    }

    await Pessoa.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Pessoa excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir pessoa' });
  }
});

module.exports = router;
