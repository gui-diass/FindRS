const express = require('express');
const router = express.Router();
const abrigoController = require('../controllers/abrigoController');

router.post('/', abrigoController.criarAbrigo);
router.get('/', abrigoController.listarAbrigos);
router.delete('/:id', abrigoController.deletarAbrigo);

module.exports = router;
