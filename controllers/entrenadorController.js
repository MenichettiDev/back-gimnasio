// Importar el servicio necesario para la consulta
const { obtenerEntrenadorPorPersona, obtenerEntrenadores, crearEntrenador } = require('../services/entrenadorService');

exports.obtenerEntrenadorByIdPersona = async (req, res) => {
    const { id_persona } = req.body; // Obtener el id_persona del cuerpo de la solicitud (req.body)

    if (!id_persona) {
        // Si no se pasa el id_persona, respondemos con un error
        return res.status(400).json({ message: 'El id_persona es obligatorio' });
    }

    try {
        // Llamar al servicio que obtiene el entrenador por el id_persona
        const resultados = await obtenerEntrenadorPorPersona(id_persona);

        if (resultados && resultados.length > 0) {
            // Si se encuentra el entrenador, devolver los datos
            return res.json( resultados[0] );
        } else {
            // Si no se encuentra el entrenador, devolver un mensaje adecuado
            return res.status(404).json({ message: 'Entrenador no encontrado para esa persona' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

exports.obtenerEntrenadores = async (req, res) => {

    try {
        const resultados = await obtenerEntrenadores();

        if (resultados && resultados.length > 0) {
            // Si se encuentra el entrenador, devolver los datos
            return res.json( resultados );
        } else {
            // Si no se encuentra el entrenador, devolver un mensaje adecuado
            return res.status(404).json({ message: 'Entrenadores no encontrados' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

exports.crearEntrenador = async (req, res) => {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const entrenadorData = req.body;

        // Validar que se proporcionen los datos necesarios
        if (
            !entrenadorData.dni ||
            !entrenadorData.nombre ||
            !entrenadorData.apellido ||
            !entrenadorData.fecha_nacimiento ||
            !entrenadorData.email ||
            !entrenadorData.fecha_ingreso
        ) {
            return res.status(400).json({
                message: 'Faltan datos obligatorios para crear el entrenador'
            });
        }

        // Llamar al servicio para crear el entrenador
        const resultado = await crearEntrenador(entrenadorData);

        // Responder con éxito
        return res.status(201).json(resultado);
    } catch (error) {
        console.error('Error al crear el entrenador:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};