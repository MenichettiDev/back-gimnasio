// src/controllers/menuController.js
const menuService = require('../services/menuService');
const conexion = require('../config/conexion');


exports.obtenerMenusByIdPersona = async (req, res) => {
    const { id_persona } = req.body; 

    if (!id_persona) {
        
        return res.status(400).json({ message: 'El id_persona es obligatorio' });
    }

    try {
        
        const resultados = await menuService.obtenerMenusPorAcceso(id_persona);

        if (resultados && resultados.length > 0) {
            
            return res.json({
                menus: resultados 
            });
        } else {
            
            return res.status(404).json({ message: 'No se encontraron menus para esta persona' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

exports.obtenerMenus = async (req, res) => {

    try {
        const resultados = await menuService.listarMenus();

        if (resultados && resultados.length > 0) {
            
            return res.json({ menus: resultados });
        } else {
            return res.status(404).json({ message: 'Menus no encontrados' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

// module.exports = {
//     obtenerMenus,
//     obtenerMenusByIdPersona
// };
