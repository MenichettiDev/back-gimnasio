const express = require('express');
const { crearSuscripcionController } = require('../controllers/suscripcionController');
const router = express.Router();

// router.post('/', crearSuscripcionController);
router.post('/crearSuscripcion', require('../controllers/suscripcionController').crearSuscripcionController);

module.exports = router;