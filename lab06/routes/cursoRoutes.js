const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');

router.route('/')
    .get(cursoController.obtenerCursos)
    .post(cursoController.crearCurso);

router.route('/:id')
    .get(cursoController.obtenerCursoPorId)
    .put(cursoController.actualizarCurso)
    .delete(cursoController.eliminarCurso);

module.exports = router;