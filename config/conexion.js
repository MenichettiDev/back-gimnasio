require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

const mysql = require('mysql');

// Crear un pool de conexiones
const conexion = mysql.createPool({
    connectionLimit: 10, // Número máximo de conexiones en el pool
    host: process.env.DB_HOST, // Usar la variable de entorno DB_HOST
    port: process.env.DB_PORT, // Usar la variable de entorno DB_PORT
    user: process.env.DB_USER, // Usar la variable de entorno DB_USER
    password: process.env.DB_PASSWORD, // Usar la variable de entorno DB_PASSWORD
    database: process.env.DB_DATABASE // Usar la variable de entorno DB_DATABASE
});

// Verificación de la conexión
conexion.getConnection((error, connection) => {
    if (error) {
        console.error('Error al conectar al pool de conexiones:', error.stack);
        return;
    }
    console.log('Conectado al pool de conexiones como ID ' + connection.threadId);
    connection.release(); // Liberar la conexión después de verificarla
});

module.exports = conexion;