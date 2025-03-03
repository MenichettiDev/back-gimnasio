const { autenticarUsuario, obtenerUsuarioLogueado } = require('../services/conectionService');


//Este middleware lo usamos para proteger rutas que requieren autenticación
exports.authMiddleware = (req, res, next) => {
    //Evitamos que se guarde la página en cache
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    //Acá se verifica si hay una sesión activa
    if (req.session && req.session.isLoggedIn) {
        //Si el usuario está autenticado, continúa con el siguiente middleware
        return next();
    } else {
        //Si el usuario no está autenticado, responde con un error 401
        return res.status(401).json({ message: 'No autenticado. Acceso denegado.' });
    }
};

exports.postLogin = async (req, res) => {
    const { usuario, contrasenia } = req.body; //Desestructuración de las variables
    console.log(usuario)
    try {
        //Llamamos a la función del servicio para autenticar al médico
        const resultados = await autenticarUsuario(usuario, contrasenia);

        if (resultados.length > 0) {
            //Si se encuentra el usuario, obtener el médico logueado
            const usuarioObtenido = await obtenerUsuarioLogueado( usuario );

            if (usuarioObtenido ) {
                //Acá almacenamos el nombre y la matrícula del médico en la sesión
                req.session.nombre = `${usuarioObtenido[0].nombre} ${usuarioObtenido[0].apellido}`;
                req.session.matricula = usuarioObtenido;
                req.session.isLoggedIn = true; //Este true marca al usuario como autenticado
                req.session.usuario = usuarioObtenido; //Acá se suarda el nombre de usuario

                //Respondes con el usuario autenticado y mensaje de éxito
                return res.json( req.session.usuario );
            } else {
                //Si el médico no se encuentra indicamos el error
                return res.status(404).json({ message: 'User no encontrado' });
            }
        } else {
            //Si las credenciales son incorrectas lo indicamos
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

//Este controlador lo usamos para verificar si el usuario está logueado
exports.getLogin = (req, res) => {
    // Si el usuario está logueado, le respondemos con el nombre y la matrícula
    if (req.session.isLoggedIn) {
        return res.json({
            message: 'Usuario autenticado',
            nombre: req.session.nombre
        });
    } else {
        return res.status(401).json({ message: 'No autenticado. Acceso denegado.' });
    }
};


exports.redirectLogin = (req, res) => {
    //Ya no redirigimos a una página, sino que devolvemos un mensaje para que el frontend lo maneje
    return res.status(401).json({ message: 'Acceso denegado. Por favor, inicie sesión.' });
};

exports.logout = (req, res) => {
    //Acá se destruye la sesión
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({ message: 'Error al cerrar sesión' });
        }
        //Respondemos con un mensaje de éxito
        res.json({ message: 'Sesión cerrada exitosamente' });
    });
};