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
router.get('/api/getMenus', menuController.obtenerMenus );
router.post('/api/menusByIdAcceso', menuController.obtenerMenusByIdAcceso ); 


//Entrenador
router.post('/api/getEntrenadorByIdPersona', entrenadorController.obtenerEntrenadorByIdPersona );
router.get('/api/getEntrenadores', entrenadorController.obtenerEntrenadores );


//Atleta
router.post('/api/getAtletaById', atletaController.obtenerAtletaByIdEntrenador );
router.post('/api/getAtletaByIdPersona', atletaController.obtenerAtletaByIdPersona );
router.get('/api/getAtletas', atletaController.obtenerAtletas );
router.post('/api/crearAtleta', atletaController.crearAtleta );
router.post('/api/editarAtleta', atletaController.editarAtleta );


// Rutas para Persona
router.get('/api/personas', usuarioController.obtenerPersonas); // Listar todas las personas
router.get('/api/personas/:id_persona', usuarioController.obtenerPersonaPorId); // Obtener una persona por ID
router.post('/api/personas', usuarioController.crearPersona); // Crear una nueva persona
router.put('/api/personas/:id_persona', usuarioController.editarPersona); // Editar una persona existente
router.delete('/api/personas/:id_persona', usuarioController.eliminarPersona); // Eliminar una persona


//Ejercicio
router.post('/api/crearEjercicio', ejercicioController.createEjercicio );
router.post('/api/getEjercicioByGrupoMuscular', ejercicioController.getEjercicioPorGrupoMuscular );
router.post('/api/getEjercicioByIdEjercicio', ejercicioController.getEjercicioById );
router.post('/api/updateEjercicio', ejercicioController.updateEjercicio );
router.post('/api/deleteEjercicio', ejercicioController.deleteEjercicio );


//Tipo de repeticion de ejercicio
router.get('/getRepeticion', repeticionController.obtenerRepeticiones );
// router.get('/repeticiones', repeticionController.obtenerRepeticiones);
router.get('/api/repeticiones/:id', repeticionController.obtenerRepeticionPorId);
router.post('/api/repeticiones', repeticionController.crearRepeticion);
router.put('/api/repeticiones/:id', repeticionController.actualizarRepeticion);
router.delete('/api/repeticiones/:id', repeticionController.eliminarRepeticion);


//Gimnasios
router.post('/api/getGimnasioByIdEntrenador', gimnasioController.obtenerGimnasioPorIdEntrenador );
router.post('/api/getGimnasioByIdAtleta', gimnasioController.obtenerGimnasioPorIdAtleta );
router.get('/api/getGimnasios', gimnasioController.obtenerGimnasios );


//Grupos musculares
router.get('/api/getGruposMusculares', gruposMuscularesController.obtenerGruposMusculares);
// router.get('/gruposMusculares', gruposMuscularesController.obtenerGruposMusculares);
router.get('/api/grupos-musculares/:id', gruposMuscularesController.obtenerGrupoMuscular);
router.post('/api/grupos-musculares', gruposMuscularesController.crearGrupoMuscular);
router.put('/api/grupos-musculares/:id', gruposMuscularesController.actualizarGrupoMuscular);
router.delete('/api/grupos-musculares/:id', gruposMuscularesController.eliminarGrupoMuscular);


//Membresias
router.post('/api/getMembresiasByIdGimnaiso', membresiaController.obtenerMembresiaByGimnasio );
router.get('/api/getMembresias', membresiaController.obtenerMembresias );


//Rutinas
router.get('/api/getRutinasFree', rutinaController.obtenerRutinasFree );
router.post('/api/getRutinaByIdAtleta', rutinaController.obtenerRutinaByIdAtleta );
router.post('/api/getRutinaByIdCreador', rutinaController.obtenerRutinaByIdCreador );
router.post('/api/getRutinaByIdRutina', rutinaController.obtenerRutinaByIdRutina );
router.post('/api/crearRutinaYAsignarAtleta', rutinaController.crearRutinaYAsignarAtleta );
router.post('/api/editarRutina', rutinaController.editarRutinaYAsignarAtleta );
router.post('/api/eliminarRutina', rutinaController.eliminarRutina );
router.post('/api/getRutinasFiltradas', rutinaController.filtrarRutinas );



//Frase
router.get('/api/getFraseAleatoria', fraseController.obtenerFraseAleatoria );


// Rutas para las formas de pago
router.get('/api/getFormasPago', formaPagoController.obtenerFormasPago); // Listar todas las formas de pago
router.get('/api/formas-pago/:id', formaPagoController.obtenerFormaPagoById); // Obtener una forma de pago por ID
router.post('/api/formas-pago', formaPagoController.crearFormaPago); // Crear una nueva forma de pago
router.put('/api/formas-pago/:id', formaPagoController.actualizarFormaPago); // Actualizar una forma de pago
router.delete('/api/formas-pago/:id', formaPagoController.eliminarFormaPago); // Eliminar una forma de pago

// Rutas para pagos
router.post('/api/getPagosPorAtleta', pagoController.getPagosPorAtleta); // Obtener pagos por atleta
router.post('/api/getPagoPorId', pagoController.getPagoPorId); // Obtener un pago por su ID
router.post('/api/createPago', pagoController.createPago); // Crear un nuevo pago
router.post('/api/updatePago', pagoController.updatePago); // Actualizar un pago existente
router.post('/api/deletePago', pagoController.deletePago); // Eliminar un pago por su ID
router.post('/api/getPagosPorFecha', pagoController.getPagosPorFecha); // Obtener pagos por fecha
router.post('/api/getTotalPagosPorAtleta', pagoController.getTotalPagosPorAtleta); // Obtener el total de pagos por atleta


// Rutas para medidas
router.get('/api/medidas', medidasController.obtenerMedidas); // Obtener todas las medidas
router.get('/api/medidas/:id', medidasController.obtenerMedidaPorId); // Obtener una medida por ID
router.get('/api/medidas/atleta/:id_atleta', medidasController.obtenerMedidasPorAtleta); // Obtener medidas por ID de atleta
router.post('/api/medidas', medidasController.crearMedida); // Crear una nueva medida
router.put('/api/medidas/:id', medidasController.actualizarMedida); // Actualizar una medida existente
router.delete('/api/medidas/:id', medidasController.eliminarMedida); // Eliminar una medida


//Logros
// 1. Obtener todos los logros
router.get('/api/logros', logrosController.obtenerLogros);
router.get('/api/logros/:id', logrosController.obtenerLogroPorId);
router.post('/api/logros', logrosController.crearLogro);
router.put('/api/logros/:id', logrosController.actualizarLogro);
router.delete('/api/logros/:id', logrosController.eliminarLogro);
router.get('/api/logros/atleta/:id_atleta', logrosController.listarLogrosPorIdAtleta);


//Metas
router.get('/api/metas', metasController.obtenerMetas);
router.get('/api/metas/:id', metasController.obtenerMetaPorId);
router.post('/api/metas', metasController.crearMeta);
router.put('/api/metas/:id', metasController.actualizarMeta);
router.delete('/api/metas/:id', metasController.eliminarMeta);
router.get('/api/metas/atleta/:id_atleta', metasController.listarMetasPorIdAtleta);

module.exports = router; 