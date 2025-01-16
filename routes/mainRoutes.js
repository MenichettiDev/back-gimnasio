const express = require('express');
const router = express.Router();
const entrenadorController = require('../controllers/entrenadorController'); //Importamos el controlador por el middleware
const atletaController = require('../controllers/atletaController');
const menuController = require('../controllers/menuController'); //Importamos el controlador de menú
const ejercicioController = require('../controllers/ejercicioController')
const repeticionController = require('../controllers/repeticionController')
const gimnasioController = require('../controllers/gimnasioController')
const gruposMuscularesController = require('../controllers/gruposMuscularesController')
const membresiaController = require('../controllers/membresiaController')




// Ruta para obtener los menús de una persona por su id_persona
router.get('/getMenus', menuController.obtenerMenus2 );
router.get('/menus/:idPersona', menuController.obtenerMenus);
router.post('/menusByIdPersona', menuController.obtenerMenusByIdPersona ); //Probar
//Entrenador
router.post('/getEntrenador-by-id', entrenadorController.obtenerEntrenadorByIdPersona );
router.get('/getEntrenadores', entrenadorController.obtenerEntrenadores );
//Atleta
router.post('/getAtletaById', atletaController.obtenerAtletaByIdEntrenador );
router.get('/getAtletas', atletaController.obtenerAtletas );
//Ejercicio
router.post('/getEjercicioByGrupoMuscular', ejercicioController.getEjercicioPorGrupoMuscular );
//Tipo de repeticion de ejercicio
router.get('/getRepeticion', repeticionController.obtenerRepeticion );
//Gimnasios
router.post('/getGimnasioByIdEntrenador', gimnasioController.obtenerGimnasioPorIdEntrenador );
router.get('/getGimnasios', gimnasioController.obtenerGimnasios );
//Grupos musculares
router.get('/getGruposMusculares', gruposMuscularesController.obtenerGruposMusculares );
//Membresias
router.post('/getMembresiasByIdGimnaiso', membresiaController.obtenerMembresiaByGimnasio );
router.get('/getMembresias', membresiaController.obtenerMembresias );





module.exports = router; 