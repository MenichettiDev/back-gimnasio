// Importar el servicio necesario para la consulta
const { listarAtletas, listarAtletasPorIdEntrenador} = require('../services/atletaService');

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

