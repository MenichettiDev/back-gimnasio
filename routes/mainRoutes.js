const express = require('express');
const router = express.Router();
const entrenadorController = require('../controllers/entrenadorController'); //Importamos el controlador por el middleware
const atletaController = require('../controllers/atletaController');
const menuController = require('../controllers/menuController'); //Importamos el controlador de menú
const ejercicioController = require('../controllers/ejercicioController')
// Ruta para obtener los menús de una persona por su id_persona
router.get('/menus/:idPersona', menuController.obtenerMenus);
//Entrenador
router.post('/getEntrenador-by-id', entrenadorController.obtenerEntrenadorByIdPersona );
router.get('/getEntrenadores', entrenadorController.obtenerEntrenadores );
//Atleta
router.post('/getAtletaById', atletaController.obtenerAtletaByIdEntrenador );
router.get('/getAtletas', atletaController.obtenerAtletas );
//Ejercicio
router.post('/getEjercicioByGrupoMuscular', ejercicioController.getEjercicioPorGrupoMuscular );

module.exports = router; 