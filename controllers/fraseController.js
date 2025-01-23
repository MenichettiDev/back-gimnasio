// Importar el servicio necesario para la consulta
const {  fraseAleatoria} = require('../services/fraseService');


exports.obtenerFraseAleatoria = async (req, res) => {

    try {
        const resultados = await fraseAleatoria();

        if (resultados && resultados.length > 0) {
            return res.json( resultados[0] );
        } else {
            return res.status(404).json( 'frase no encontrada');
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json( 'Error en la base de datos' );
    }
};

