const conexion = require('../config/conexion');
//Pool listo
// 1. Listar membresías por ID de gimnasio
const listarMembresiasByIdGimnasio = (id_gimnasio) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryMembresia = `
                SELECT * 
                FROM tb_membresia m 
                WHERE m.id_gimnasio = ?
            `;
            connection.query(queryMembresia, [id_gimnasio], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve las membresías filtradas por gimnasio
            });
        });
    });
};

// 2. Listar todas las membresías
const listarMembresias = () => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryMembresia = 'SELECT * FROM tb_membresia';
            connection.query(queryMembresia, (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve todas las membresías
            });
        });
    });
};

module.exports = {
    listarMembresias,
    listarMembresiasByIdGimnasio
};