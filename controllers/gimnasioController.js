// Importar el servicio necesario para la consulta
const { listarGimnasioPorIdEntrenador, listarGimnasios, listarGimnasioPorIdAtleta } = require('../services/gimnasioService');



exports.obtenerGimnasios = async (req, res) => {

    try {
        const resultados = await listarGimnasios();

        if (resultados && resultados.length > 0) {
            return res.json(resultados);
        } else {
            // Si no se encuentra el entrenador, devolver un mensaje adecuado
            return res.status(404).json({ message: 'Gimnasios no encontrados' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' , error});
    }
};


exports.obtenerGimnasioPorIdEntrenador = async (req, res) => {
    const { id_entrenador } = req.body;

    if (!id_entrenador) {
        return res.status(400).json({ message: 'El id_entrenador es obligatorio' });
    }

    try {
        const resultados = await listarGimnasioPorIdEntrenador(id_entrenador);

        if (resultados && resultados.length > 0) {
            return res.json(
                resultados // Retornar los resultados de los atletas
            );
        } else {
            // Si no se encuentran atletas, devolver un mensaje adecuado
            return res.status(404).json({ message: 'No se encontraron gimnasios para este entrenador' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};


exports.obtenerGimnasioPorIdAtleta = async (req, res) => {
    const { id_atleta } = req.body;

    if (!id_atleta) {
        return res.status(400).json({ message: 'El id_atleta es obligatorio' });
    }

    try {
        const resultados = await listarGimnasioPorIdAtleta(id_atleta);

        if (resultados && resultados.length > 0) {
            return res.json(
                resultados[0] // Retornar los resultados de los atletas
            );
        } else {
            // Si no se encuentran atletas, devolver un mensaje adecuado
            return res.status(404).json({ message: 'No se encontraron gimnasios para este atleta' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};