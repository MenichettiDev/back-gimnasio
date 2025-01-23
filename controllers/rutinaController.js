// Importar el servicio necesario para la consulta
const { listarRutinaByIdAtleta, listarRutinaByIdCreador, listarRutinasFree } = require('../services/rutinaService');

exports.obtenerRutinaByIdAtleta = async (req, res) => {
    const { id_atleta } = req.body;

    if (!id_atleta) {

        return res.status(400).json({ message: 'El id_atleta es obligatorio' });
    }

    try {

        const resultados = await listarRutinaByIdAtleta(id_atleta);

        if (resultados && resultados.length > 0) {

            return res.json(
                resultados
            );
        } else {

            return res.status(404).json({ message: 'No se encontraron rutinas para este atleta' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

exports.obtenerRutinaByIdCreador = async (req, res) => {
    const { id_persona } = req.body;

    if (!id_persona) {

        return res.status(400).json({ message: 'El id_persona es obligatorio' });
    }

    try {

        const resultados = await listarRutinaByIdCreador(id_persona);

        if (resultados && resultados.length > 0) {

            return res.json({
                rutinas: resultados
            });
        } else {

            return res.status(404).json({ message: 'No se encontraron rutinas para esta persona' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

exports.obtenerRutinasFree = async (req, res) => {

    try {
        const resultados = await listarRutinasFree();

        if (resultados && resultados.length > 0) {

            return res.json({ rutinas: resultados });
        } else {
            return res.status(404).json({ message: 'Rutinas no encontrados' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

