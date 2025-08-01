// Importar el servicio necesario para la consulta
const { listarPersonas, obtenerPersonaPorId, crearPersona, editarPersona, eliminarPersona } = require('../services/usuarioService');

// 1. Listar todas las personas
exports.obtenerPersonas = async (req, res) => {
    try {
        const resultados = await listarPersonas();
        if (resultados && resultados.length > 0) {
            return res.json(resultados);
        } else {
            return res.status(404).json({ message: 'No se encontraron personas' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// 2. Obtener una persona por su ID
exports.obtenerPersonaPorId = async (req, res) => {
    try {
        const { id_persona } = req.params;
        if (!id_persona) {
            return res.status(400).json({ message: 'El id_persona es obligatorio' });
        }

        const resultado = await obtenerPersonaPorId(parseInt(id_persona));
        return res.json(resultado);
    } catch (error) {
        console.error('Error al obtener la persona:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// 3. Crear una nueva persona
exports.crearPersona = async (req, res) => {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const personaData = req.body;

        // Validar que se proporcionen los datos obligatorios
        if (
            !personaData.dni ||
            !personaData.nombre ||
            !personaData.apellido ||
            !personaData.fecha_nacimiento ||
            !personaData.email
        ) {
            return res.status(400).json({ message: 'Faltan datos obligatorios para crear la persona' });
        }

        // Llamar al servicio para crear la persona
        const resultado = await crearPersona(personaData);

        // Responder con éxito
        return res.status(201).json(resultado);
    } catch (error) {
        console.error('Error al crear la persona:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// 4. Editar una persona existente
exports.editarPersona = async (req, res) => {
    try {
        // Extraer el ID de la persona de los parámetros de la URL
        const { id_persona } = req.params;

        // Extraer los datos del cuerpo de la solicitud
        const personaData = req.body;

        // Validar que se proporcione al menos un campo para actualizar
        if (Object.keys(personaData).length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
        }

        // Llamar al servicio para editar la persona
        const resultado = await editarPersona(parseInt(id_persona), personaData);

        // Responder con éxito
        return res.status(200).json(resultado);
    } catch (error) {
        console.error('Error al editar la persona:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// 5. Eliminar una persona por su ID
exports.eliminarPersona = async (req, res) => {
    try {
        // Extraer el ID de la persona de los parámetros de la URL
        const { id_persona } = req.params;

        if (!id_persona) {
            return res.status(400).json({ message: 'El id_persona es obligatorio' });
        }

        // Llamar al servicio para eliminar la persona
        const resultado = await eliminarPersona(parseInt(id_persona));

        // Responder con éxito
        return res.status(200).json(resultado);
    } catch (error) {
        console.error('Error al eliminar la persona:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};