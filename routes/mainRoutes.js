const express = require('express');
const router = express.Router();
const entrenadorController = require('../controllers/entrenadorController'); //Importamos el controlador por el middleware
const atletaController = require('../controllers/atletaController');
const menuController = require('../controllers/menuController'); //Importamos el controlador de menú

// Ruta para obtener los menús de una persona por su id_persona
router.get('/menus/:idPersona', menuController.obtenerMenus);
//Entrenador
router.post('/obtener-entrenador-by-id', entrenadorController.obtenerEntrenadorByIdPersona );
router.get('/obtener-entrenadores', entrenadorController.obtenerEntrenadores );
//Atleta
router.post('/obtener-atleta-by-id', atletaController.obtenerAtletaByIdEntrenador );
router.get('/obtener-atletas', atletaController.obtenerAtletas );

module.exports = router; 