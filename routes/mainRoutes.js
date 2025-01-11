const express = require('express');
const router = express.Router();
const entrenadorController = require('../controllers/entrenadorController'); //Importamos el controlador por el middleware
const menuController = require('../controllers/menuController'); //Importamos el controlador de menú

// Ruta para obtener los menús de una persona por su id_persona
router.get('/menus/:idPersona', menuController.obtenerMenus);

router.post('/obtener-entrenador-by-id', entrenadorController.obtenerEntrenadorByIdPersona );
router.get('/obtener-entrenadores', entrenadorController.obtenerEntrenadores );



module.exports = router; 