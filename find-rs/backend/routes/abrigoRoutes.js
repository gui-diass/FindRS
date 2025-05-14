const express = require('express');
const router = express.Router();
const abrigoController = require('../controllers/abrigoController');

router.post('/', abrigoController.criarAbrigo);
router.get('/', abrigoController.listarAbrigos);

module.exports = router;
