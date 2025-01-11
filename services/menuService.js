const conexion = require('../config/conexion');

// Servicio para obtener los menús según el id_acceso
const obtenerMenusPorAcceso = ( id_acceso ) => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT m.*
        FROM tb_menu m 
        JOIN tb_menu_perfil mp ON m.id_menu = mp.id_menu
        JOIN tb_perfil p ON p.id_perfil = mp.id_perfil
        WHERE p.id_perfil = ? and m.menu_estado = 1 ORDER BY m.menu_orden;
        `;
        conexion.query(query, [ id_acceso ], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
   obtenerMenusPorAcceso //Exporta la función para obtener los datos del médico logueado
};