require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

const express = require('express'); //Importamos Express, que nos ayuda a crear el servidor.
const app = express(); //Creamos una instancia de la aplicación Express.
const path = require('path'); //Usamos path para trabajar con rutas de archivos de forma más sencilla.
const mainRoutes = require('./routes/mainRoutes'); //Importamos las rutas principales desde la carpeta 'routes'.
const authRoutes = require('./routes/authRoutes'); //Importamos las rutas de autenticación.
const bodyParser = require('body-parser'); //Middleware para analizar el cuerpo de las solicitudes HTTP.
const cors = require('cors');

//errores
const fs = require('fs');
const morgan = require('morgan'); // Instala con: npm install morgan

// Crear archivo de logs
const logStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'api.log'), 
  { flags: 'a' }
);

// Registrar todas las peticiones
app.use(morgan('combined', { stream: logStream }));

// Middleware para errores
app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err.stack); // Muestra errores en consola
  logStream.write(`❌ [${new Date().toISOString()}] ${err.stack}\n`); // Guarda en archivo
  res.status(500).json({ error: 'Internal Server Error' });
});
//////////////////////////////////////////////////////////


//Sesiones
const session = require('express-session'); //Middleware para gestionar sesiones de usuario.

app.use(express.json()); //Si necesitas manejar JSON en tu aplicación.

// Configuración de express-session
app.use(session({
  secret: 'claveSecreta', //Cambia por una clave secreta más segura.
  resave: false, //No volver a guardar la sesión si no ha sido modificada.
  saveUninitialized: true, //Guardar sesiones nuevas aunque no tengan datos.
  cookie: { secure: true } //Cambia a true si usas HTTPS.
}));



const allowedOrigins = [
  'http://localhost:4200',
  'https://localhost:4200',
  'https://gymrats.com.ar', // Dominio frontend
  'https://www.gymrats.com.ar' // Variante con www
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS bloqueado: ${origin}`));
    }
  },
  credentials: true // ¡Importante para cookies/sesiones!
}));

// ¡Antes de las rutas!
app.set('trust proxy', true); // Confía en el proxy (OpenLiteSpeed)

// Middleware para manejar solicitudes OPTIONS
app.options('*', cors()); // Habilita CORS para todas las rutas y métodos OPTIONS

// Todas las rutas definidas en mainRoutes estarán bajo "/api"
app.use('/', mainRoutes);
app.use('/', authRoutes); // Rutas de autenticación bajo "/api"

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Algo salió mal', error: err.message });
});


//Configuración del puerto
const PORT = process.env.PORT || 7000; //Usa el puerto del entorno o el 7000 por defecto.

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
