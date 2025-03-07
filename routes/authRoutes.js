const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); //Importamos el controlador para manejar la autenticación

//Ruta para mostrar la página de inicio de sesión
router.get('/api/login', authController.getLogin); 

//Ruta para redirigir a los usuarios a la página de inicio de sesión si acceden a la raíz "/"
router.get('/api/', authController.redirectLogin);

//Ruta para manejar el envío del formulario de inicio de sesión
router.post('/api/login', authController.postLogin); 

//Ruta para cerrar sesión del usuario
router.post('/api/logout', authController.logout); //Llamamos al método logout para cerrar la sesión

module.exports = router; //Exportamos el router para poder usarlo en otras partes de la aplicación
