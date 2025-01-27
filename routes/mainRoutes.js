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
const rutinaController = require('../controllers/rutinaController')
const fraseController = require('../controllers/fraseController')




// Ruta para obtener los menús de una persona por su id_persona
router.get('/getMenus', menuController.obtenerMenus );
router.post('/menusByIdAcceso', menuController.obtenerMenusByIdAcceso ); 
//Entrenador
router.post('/getEntrenadorById', entrenadorController.obtenerEntrenadorByIdPersona );
router.get('/getEntrenadores', entrenadorController.obtenerEntrenadores );
//Atleta
router.post('/getAtletaById', atletaController.obtenerAtletaByIdEntrenador );
router.get('/getAtletas', atletaController.obtenerAtletas );
//Ejercicio

router.post('/crearEjercicio', ejercicioController.createEjercicio );
router.post('/getEjercicioByGrupoMuscular', ejercicioController.getEjercicioPorGrupoMuscular );
router.post('/getEjercicioByIdEjercicio', ejercicioController.getEjercicioById );
router.post('/updateEjercicio', ejercicioController.updateEjercicio );
router.post('/deleteEjercicio', ejercicioController.deleteEjercicio );
// by id_ejercicio
// editar
//borrar
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
//Rutinas
router.get('/getRutinasFree', rutinaController.obtenerRutinasFree );
router.post('/getRutinaByIdAtleta', rutinaController.obtenerRutinaByIdAtleta );
router.post('/getRutinaByIdCreador', rutinaController.obtenerRutinaByIdCreador );
router.post('/crearRutinaYAsignarAtleta', rutinaController.crearRutinaYAsignarAtleta );
router.post('/editarRutina', rutinaController.editarRutinaYAsignarAtleta );
router.post('/eliminarRutina', rutinaController.eliminarRutina );
//Frase
router.get('/getFraseAleatoria', fraseController.obtenerFraseAleatoria );



module.exports = router; 