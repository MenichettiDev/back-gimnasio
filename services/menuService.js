const conexion = require('../config/conexion');
// Pool
// Servicio para obtener los menús según el id_acceso
const obtenerMenusPorAcceso = (id_acceso) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = `
                SELECT m.*
                FROM tb_menu m 
                JOIN tb_menu_perfil mp ON m.id_menu = mp.id_menu
                JOIN tb_perfil p ON p.id_perfil = mp.id_perfil
                WHERE p.id_perfil = ? AND m.menu_estado = 1 
                ORDER BY m.menu_orden;
            `;

            connection.query(query, [id_acceso], (error, results) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(results); // Devuelve los menús filtrados por acceso
            });
        });
    });
};

// Servicio para listar todos los menús
const listarMenus = () => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryMenu = 'SELECT * FROM tb_menu';
            connection.query(queryMenu, (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve todos los menús
            });
        });
    });
};

module.exports = {
    obtenerMenusPorAcceso,
    listarMenus
};