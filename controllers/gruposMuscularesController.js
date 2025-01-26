// Importar el servicio necesario para la consulta
const { listarGruposMusculares} = require('../services/gruposMuscularesService');


exports.obtenerGruposMusculares = async (req, res) => {

    try {
        const resultados = await listarGruposMusculares();

        if (resultados && resultados.length > 0) {
            
            return res.json( resultados );
        } else {
            return res.status(404).json({ message: 'Grupos musculares no encontrados' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

