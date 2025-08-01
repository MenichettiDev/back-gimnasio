const express = require('express');
const router = express.Router();
const suscripcionController = require('../controllers/suscripcionController'); //Importamos el controlador para manejar la autenticación

// router.post('/', crearSuscripcionController);
router.post('/crearSuscripcion', suscripcionController.crearSuscripcionController);

module.exports = router;

