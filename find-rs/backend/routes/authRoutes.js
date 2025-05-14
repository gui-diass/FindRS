const express = require('express');
const router = express.Router();
const Abrigo = require('../models/Abrigo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const abrigo = await Abrigo.findOne({ email });
    if (!abrigo) {
      return res.status(404).json({ error: 'Abrigo não encontrado' });
    }

    const senhaConfere = await bcrypt.compare(senha, abrigo.senha);
    if (!senhaConfere) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: abrigo._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ token, abrigo });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro interno no login' });
  }
});

module.exports = router;
