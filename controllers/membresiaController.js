// Importar el servicio necesario para la consulta
const { listarMembresias, listarMembresiasByIdGimnasio} = require('../services/membresiaService');

exports.obtenerMembresiaByGimnasio = async (req, res) => {
    const { id_gimnasio } = req.body; 

    if (!id_gimnasio) {
        
        return res.status(400).json({ message: 'El id_gimnasio es obligatorio' });
    }

    try {
        
        const resultados = await listarMembresiasByIdGimnasio(id_gimnasio);

        if (resultados && resultados.length > 0) {
            
            return res.json({
                membresias: resultados 
            });
        } else {
            
            return res.status(404).json({ message: 'No se encontraron membresias para ese gimnasio' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};


exports.obtenerMembresias = async (req, res) => {

    try {
        const resultados = await listarMembresias();

        if (resultados && resultados.length > 0) {
            
            return res.json({ membresias: resultados });
        } else {
            return res.status(404).json({ message: 'Membresias no encontradas' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

