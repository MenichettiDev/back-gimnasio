require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

const express = require('express'); //Importamos Express, que nos ayuda a crear el servidor.
const app = express(); //Creamos una instancia de la aplicación Express.
const path = require('path'); //Usamos path para trabajar con rutas de archivos de forma más sencilla.
const mainRoutes = require('./routes/mainRoutes'); //Importamos las rutas principales desde la carpeta 'routes'.
const authRoutes = require('./routes/authRoutes'); //Importamos las rutas de autenticación.
const ejercicioRoutes = require('./routes/ejercicioRoutes');
const bodyParser = require('body-parser'); //Middleware para analizar el cuerpo de las solicitudes HTTP.
const cors = require('cors');
const suscripcionRoutes = require('./routes/suscripcionRoutes');
const webhookRoutes = require('./routes/webHookRoutes'); // Importamos las rutas del webhook
const fs = require('fs');
const MEDIA_ROOT = process.env.MEDIA_ROOT || path.join(path.sep, 'media');



app.set('trust proxy', true); // ¡Confía en el proxy (OpenLiteSpeed)!

//Sesiones
const session = require('express-session'); //Middleware para gestionar sesiones de usuario.

app.use(express.json()); //Si necesitas manejar JSON en tu aplicación.

//Configuración de express-session
// app.use(session({
//   secret: 'claveSecreta', //Cambia por una clave secreta más segura.
//   resave: false, //No volver a guardar la sesión si no ha sido modificada.
//   saveUninitialized: true, //Guardar sesiones nuevas aunque no tengan datos.
//   cookie: { secure: true } //Cambia a true si usas HTTPS.
// }));

app.use(session({
  secret: 'claveSecreta', // Usa una clave segura (mejor en .env)
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // false en desarrollo
    sameSite: 'none', // Necesario para cross-site cookies
    httpOnly: true
  }
}));

// app.js

const allowedOrigins = [
  'http://localhost:4200',
  'https://localhost:4200',
  'https://gymrats.com.ar', // Asegúrate de incluir HTTPS si es necesario
  'https://www.gymrats.com.ar' // Asegúrate de incluir HTTPS si es necesario
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origen no permitido: ${origin}`));
    }
  },
  credentials: true // ¡Clave para cookies/sesiones!
}));
//errrores de cors
app.use((err, req, res, next) => {
  if (err.message.startsWith('Origen no permitido')) {
    console.warn(`CORS error: ${err.message}`);
    return res.status(403).json({ error: 'Acceso no permitido por CORS' });
  }
  next(err);
});
///////
// Middleware para registrar todas las solicitudes entrantes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Continúa con el siguiente middleware o ruta
});
// Middleware para manejar solicitudes OPTIONS
app.options('*', cors()); // Habilita CORS para todas las rutas y métodos OPTIONS

app.use('/api/', suscripcionRoutes);
app.use('/api/', mainRoutes);
app.use('/api/', authRoutes);
app.use('/api/', ejercicioRoutes);
app.use('/webhook/', webhookRoutes); // Asegúrate de que esta ruta esté definida

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Algo salió mal', error: err.message });
});

// Asegurar carpeta MEDIA_ROOT y servirla estáticamente en /media
try {
  fs.mkdirSync(MEDIA_ROOT, { recursive: true });
} catch (e) {
  console.warn('No se pudo crear MEDIA_ROOT:', e.message);
}
app.use('/media', express.static(MEDIA_ROOT));

//Configuración del puerto
const PORT = process.env.PORT || 7000; //Usa el puerto del entorno o el 7000 por defecto.

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
