require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

const mysql = require('mysql');

// Usar las variables de entorno
const conexion = mysql.createConnection({
    host: process.env.DB_HOST, // Usar la variable de entorno DB_HOST
    port: process.env.DB_PORT, // Usar la variable de entorno DB_PORT
    user: process.env.DB_USER, // Usar la variable de entorno DB_USER
    password: process.env.DB_PASSWORD, // Usar la variable de entorno DB_PASSWORD
    database: process.env.DB_DATABASE // Usar la variable de entorno DB_DATABASE
});

// Verificación de la conexión
conexion.connect((error) => {
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
    console.log('DB_DATABASE:', process.env.DB_DATABASE);
    if (error) {
        console.error('Error al conectar a la base de datos:', error.stack);
        return;
    }
    console.log('Conectado a la base de datos como ID ' + conexion.threadId);
});

module.exports = conexion;
