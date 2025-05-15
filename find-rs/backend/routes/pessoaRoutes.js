const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Pessoa = require('../models/Pessoa');

// Configurar destino e nome do arquivo
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const nomeUnico = Date.now() + '-' + file.originalname;
        cb(null, nomeUnico);
    },
});

const upload = multer({ storage });

router.post('/', upload.single('foto'), async (req, res) => {
    try {
        const { nome, abrigoId } = req.body;
        const novaPessoa = new Pessoa({
            nome,
            foto: req.file.filename,
            abrigoId,
        });

        const salva = await novaPessoa.save();
        res.status(201).json(salva);
    } catch (err) {
        console.error('Erro ao salvar pessoa:', err);
        res.status(500).json({ error: 'Erro ao salvar pessoa' });
    }
});

router.get('/', async (req, res) => {
    const { abrigoId } = req.query;
    try {
        const pessoas = await Pessoa.find({ abrigoId });
        res.json(pessoas);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar pessoas' });
    }
});


const fs = require('fs');

router.delete('/:id', async (req, res) => {
    try {
        const pessoa = await Pessoa.findById(req.params.id);
        if (!pessoa) return res.status(404).json({ error: 'Pessoa não encontrada' });

        const caminhoImagem = path.join(__dirname, '..', 'uploads', pessoa.foto);

        await Pessoa.findByIdAndDelete(req.params.id);

        fs.unlink(caminhoImagem, (err) => {
            if (err) {
                console.error('Erro ao deletar imagem:', err);
            } else {
                console.log('Imagem deletada com sucesso:', pessoa.foto);
            }
        });

        res.status(204).end();
    } catch (err) {
        console.error('Erro ao excluir pessoa:', err);
        res.status(500).json({ error: 'Erro ao excluir pessoa' });
    }
});




module.exports = router;
