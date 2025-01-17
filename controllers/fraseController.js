// Importar el servicio necesario para la consulta
const { listarAtletas, listarAtletasPorIdEntrenador, fraseAleatoria} = require('../services/fraseService');


exports.obtenerFraseAleatoria = async (req, res) => {

    try {
        const resultados = await fraseAleatoria();

        if (resultados && resultados.length > 0) {
            return res.json({ frase: resultados });
        } else {
            return res.status(404).json({ message: 'frase no encontrada' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

