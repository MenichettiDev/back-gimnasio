// Importar el servicio necesario para la consulta
const { listarAtletas, listarAtletasPorIdEntrenador, crearAtleta, editarAtleta} = require('../services/atletaService');

exports.obtenerAtletaByIdEntrenador = async (req, res) => {
    const { id_persona } = req.body;

    if (!id_persona) {

        return res.status(400).json({ message: 'El id_persona es obligatorio' });
    }

    try {

        const resultados = await listarAtletasPorIdEntrenador(id_persona);

        if (resultados && resultados.length > 0) {

            return res.json({
                atletas: resultados
            });
        } else {

            return res.status(404).json({ message: 'No se encontraron atletas para este entrenador' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};


exports.obtenerAtletas = async (req, res) => {

    try {
        const resultados = await listarAtletas();

        if (resultados && resultados.length > 0) {

            return res.json({ atletas: resultados });
        } else {
            return res.status(404).json({ message: 'Atletas no encontrados' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

exports.crearAtleta = async (req, res) => {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const atletaData = req.body;

        // Validar que se proporcionen los datos necesarios
        if (!atletaData.dni || !atletaData.nombre || !atletaData.apellido || !atletaData.fecha_nacimiento || !atletaData.email || !atletaData.id_entrenador || !atletaData.id_gimnasio) {
            return res.status(400).json({ message: 'Faltan datos obligatorios para crear el atleta' });
        }

        // Llamar al servicio para crear el atleta
        const resultado = await crearAtleta(atletaData);

        // Responder con éxito
        return res.status(201).json(resultado);
    } catch (error) {
        console.error('Error al crear el atleta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

exports.editarAtleta = async (req, res) => {
    try {
        // Extraer el ID del atleta de los parámetros de la URL
        const { idAtleta } = req.params;

        // Extraer los datos del cuerpo de la solicitud
        const atletaData = req.body;

        // Validar que se proporcione al menos un campo para actualizar
        if (Object.keys(atletaData).length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
        }

        // Llamar al servicio para editar el atleta
        const resultado = await editarAtleta(parseInt(idAtleta), atletaData);

        // Responder con éxito
        return res.status(200).json(resultado);
    } catch (error) {
        console.error('Error al editar el atleta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};