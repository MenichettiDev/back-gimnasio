// Importar el servicio necesario para la consulta
const { listarAtletas, listarAtletasPorIdEntrenador} = require('../services/atletaService');

exports.obtenerAtletaByIdEntrenador = async (req, res) => {
    const { id_persona } = req.body; // Obtener el id_persona del cuerpo de la solicitud (req.body)

    if (!id_persona) {
        // Si no se pasa el id_persona, respondemos con un error
        return res.status(400).json({ message: 'El id_persona es obligatorio' });
    }

    try {
        // Llamar al servicio que obtiene los atletas por el id_persona
        const resultados = await listarAtletasPorIdEntrenador(id_persona);

        if (resultados && resultados.length > 0) {
            // Si se encuentran atletas, devolver los datos
            return res.json({
                atletas: resultados // Retornar los resultados de los atletas
            });
        } else {
            // Si no se encuentran atletas, devolver un mensaje adecuado
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
            // Si se encuentra el entrenador, devolver los datos
            return res.json({ atletas: resultados });
        } else {
            // Si no se encuentra el entrenador, devolver un mensaje adecuado
            return res.status(404).json({ message: 'Atletas no encontrados' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

