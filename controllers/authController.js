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
    const { usuario, contrasenia } = req.body;

    try {
        const usuarioValido = await autenticarUsuario(usuario, contrasenia);

        if (!usuarioValido) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        const usuarioLogueado = await obtenerUsuarioLogueado(usuarioValido.email);

        // Ya tenés al usuario válido
        return res.json({
            success: true,
            usuario: usuarioLogueado
        });

    } catch (error) {
        console.error('Error al autenticar:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
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



