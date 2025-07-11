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
const formaPagoController = require('../controllers/formaPagoController')
const pagoController = require('../controllers/pagoController')
const usuarioController = require('../controllers/usuarioController'); //Importamos el controlador por el middleware
const medidasController = require('../controllers/medidasController'); //Importamos el controlador por el middleware
const logrosController = require('../controllers/logrosController');
const metasController = require('../controllers/metasController');


// Ruta para obtener los menús de una persona por su id_persona
router.get('/getMenus', menuController.obtenerMenus);
router.post('/menusByIdAcceso', menuController.obtenerMenusByIdAcceso);


//Entrenador
router.post('/getEntrenadorByIdPersona', entrenadorController.obtenerEntrenadorByIdPersona);
router.post('/crearEntrenador', entrenadorController.crearEntrenador);
router.post('/asignar-gimnasio', entrenadorController.asignarGimnasios);
router.get('/getEntrenadores', entrenadorController.obtenerEntrenadores);


//Atleta
router.post('/getAtletaById', atletaController.obtenerAtletaByIdEntrenador);
router.post('/getAtletaByIdPersona', atletaController.obtenerAtletaByIdPersona);
router.get('/getAtletas', atletaController.obtenerAtletas);
router.post('/crearAtleta', atletaController.crearAtleta);
router.post('/editarAtleta', atletaController.editarAtleta);


// Rutas para Persona
router.get('/personas', usuarioController.obtenerPersonas); // Listar todas las personas
router.get('/personas/:id_persona', usuarioController.obtenerPersonaPorId); // Obtener una persona por ID
router.post('/personas', usuarioController.crearPersona); // Crear una nueva persona
router.put('/personas/:id_persona', usuarioController.editarPersona); // Editar una persona existente
router.delete('/personas/:id_persona', usuarioController.eliminarPersona); // Eliminar una persona


//Ejercicio
router.post('/crearEjercicio', ejercicioController.createEjercicio);
router.post('/getEjercicioByGrupoMuscular', ejercicioController.getEjercicioPorGrupoMuscular);
router.post('/getEjercicioByIdEjercicio', ejercicioController.getEjercicioById);
router.post('/updateEjercicio', ejercicioController.updateEjercicio);
router.post('/deleteEjercicio', ejercicioController.deleteEjercicio);


//Tipo de repeticion de ejercicio
router.get('/getRepeticion', repeticionController.obtenerRepeticiones);
// router.get('/repeticiones', repeticionController.obtenerRepeticiones);
router.get('/repeticiones/:id', repeticionController.obtenerRepeticionPorId);
router.post('/repeticiones', repeticionController.crearRepeticion);
router.put('/repeticiones/:id', repeticionController.actualizarRepeticion);
router.delete('/repeticiones/:id', repeticionController.eliminarRepeticion);


//Gimnasios
router.post('/getGimnasioByIdEntrenador', gimnasioController.obtenerGimnasioPorIdEntrenador);
router.post('/getGimnasioByIdAtleta', gimnasioController.obtenerGimnasioPorIdAtleta);
router.get('/getGimnasios', gimnasioController.obtenerGimnasios);
router.post('/crearGimnasio', gimnasioController.crearGimnasio);


//Grupos musculares
router.get('/getGruposMusculares', gruposMuscularesController.obtenerGruposMusculares);
// router.get('/gruposMusculares', gruposMuscularesController.obtenerGruposMusculares);
router.get('/grupos-musculares/:id', gruposMuscularesController.obtenerGrupoMuscular);
router.post('/grupos-musculares', gruposMuscularesController.crearGrupoMuscular);
router.put('/grupos-musculares/:id', gruposMuscularesController.actualizarGrupoMuscular);
router.delete('/grupos-musculares/:id', gruposMuscularesController.eliminarGrupoMuscular);


//Membresias
router.post('/getMembresiasByIdGimnaiso', membresiaController.obtenerMembresiaByGimnasio);
router.get('/getMembresias', membresiaController.obtenerMembresias);


//Rutinas
router.get('/getRutinasFree', rutinaController.obtenerRutinasFree);
router.post('/getRutinaByIdAtleta', rutinaController.obtenerRutinaByIdAtleta);
router.post('/getRutinaByIdCreador', rutinaController.obtenerRutinaByIdCreador);
router.post('/getRutinaByIdRutina', rutinaController.obtenerRutinaByIdRutina);
router.post('/crearRutinaYAsignarAtleta', rutinaController.crearRutinaYAsignarAtleta);
router.post('/editarRutina', rutinaController.editarRutinaYAsignarAtleta);
router.post('/eliminarRutina', rutinaController.eliminarRutina);
router.post('/getRutinasFiltradas', rutinaController.filtrarRutinas);



//Frase
router.get('/getFraseAleatoria', fraseController.obtenerFraseAleatoria);


// Rutas para las formas de pago
router.get('/getFormasPago', formaPagoController.obtenerFormasPago); // Listar todas las formas de pago
router.get('/formas-pago/:id', formaPagoController.obtenerFormaPagoById); // Obtener una forma de pago por ID
router.post('/formas-pago', formaPagoController.crearFormaPago); // Crear una nueva forma de pago
router.put('/formas-pago/:id', formaPagoController.actualizarFormaPago); // Actualizar una forma de pago
router.delete('/formas-pago/:id', formaPagoController.eliminarFormaPago); // Eliminar una forma de pago

// Rutas para pagos
router.post('/getPagosPorAtleta', pagoController.getPagosPorAtleta); // Obtener pagos por atleta
router.post('/getPagoPorId', pagoController.getPagoPorId); // Obtener un pago por su ID
router.post('/createPago', pagoController.createPago); // Crear un nuevo pago
router.post('/updatePago', pagoController.updatePago); // Actualizar un pago existente
router.post('/deletePago', pagoController.deletePago); // Eliminar un pago por su ID
router.post('/getPagosPorFecha', pagoController.getPagosPorFecha); // Obtener pagos por fecha
router.post('/getTotalPagosPorAtleta', pagoController.getTotalPagosPorAtleta); // Obtener el total de pagos por atleta


// Rutas para medidas
router.get('/medidas', medidasController.obtenerMedidas); // Obtener todas las medidas
router.get('/medidas/:id', medidasController.obtenerMedidaPorId); // Obtener una medida por ID
router.get('/medidas/atleta/:id_atleta', medidasController.obtenerMedidasPorAtleta); // Obtener medidas por ID de atleta
router.post('/medidas', medidasController.crearMedida); // Crear una nueva medida
router.put('/medidas/:id', medidasController.actualizarMedida); // Actualizar una medida existente
router.delete('/medidas/:id', medidasController.eliminarMedida); // Eliminar una medida


//Logros
// 1. Obtener todos los logros
router.get('/logros', logrosController.obtenerLogros);
router.get('/logros/:id', logrosController.obtenerLogroPorId);
router.post('/logros', logrosController.crearLogro);
router.put('/logros/:id', logrosController.actualizarLogro);
router.delete('/logros/:id', logrosController.eliminarLogro);
router.get('/logros/atleta/:id_atleta', logrosController.listarLogrosPorIdAtleta);


//Metas
router.get('/metas', metasController.obtenerMetas);
router.get('/metas/:id', metasController.obtenerMetaPorId);
router.post('/metas', metasController.crearMeta);
router.put('/metas/:id', metasController.actualizarMeta);
router.delete('/metas/:id', metasController.eliminarMeta);
router.get('/metas/atleta/:id_atleta', metasController.listarMetasPorIdAtleta);

module.exports = router; 