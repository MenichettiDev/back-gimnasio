// Importar el servicio necesario para la consulta
const { listarRepeticiones } = require('../services/repeticionService');


exports.obtenerRepeticion = async (req, res) => {

    try {
        const resultados = await listarRepeticiones();

        if (resultados && resultados.length > 0) {
            // Si se encuentra el entrenador, devolver los datos
            return res.json({ repeticiones: resultados });
        } else {
            // Si no se encuentra el entrenador, devolver un mensaje adecuado
            return res.status(404).json({ message: 'Repeticiones no encontradas' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

