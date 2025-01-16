// src/controllers/menuController.js
const menuService = require('../services/menuService');
const conexion = require('../config/conexion');

// Controlador para obtener los menús de un usuario por su id_persona
exports.obtenerMenus = (req, res) => {
    const { idPersona } = req.params;
    // Primero, obtener el id_acceso de la persona
    conexion.query(
        'SELECT p.id_acceso FROM tb_persona p WHERE p.id_persona = ?;',
        [idPersona],
        (err, results) => {
            if (err) {
                return res.status(500).send('Error al obtener el acceso de la persona');
            }

            if (results.length === 0) {
                // Si no se encuentra la persona, asignar id_acceso a 4 (perfil "visita")
                const idAcceso = 4;
                // Luego, obtener los menús para el perfil "visita"
                menuService.obtenerMenusPorAcceso(idAcceso)
                    .then(menus => res.json(menus))
                    .catch(err => res.status(500).send('Error al obtener los menús'));
            } else {
                // Si se encuentra la persona, usar el id_acceso de la persona
                const idAcceso = results[0].id_acceso;
                // Obtener los menús para el id_acceso correspondiente
                menuService.obtenerMenusPorAcceso(idAcceso)
                    .then(menus => res.json(menus))
                    .catch(err => res.status(500).send('Error al obtener los menús'));
            }
        }
    );
};

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

exports.obtenerMenus2 = async (req, res) => {

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
