// src/controllers/menuController.js
const menuService = require('../services/menuService');
const conexion = require('../config/conexion');

// Controlador para obtener los menús de un usuario por su id_persona
const obtenerMenus = (req, res) => {
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

module.exports = {
    obtenerMenus
};
