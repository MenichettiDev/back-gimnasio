const conexion = require('../config/conexion');
//Pool aplicado
// 1. Listar todos los gimnasios

const listarGimnasios = () => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryGimnasios = 'SELECT * FROM tb_gimnasio';
            connection.query(queryGimnasios, (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve todos los gimnasios
            });
        });
    });
};

// 2. Listar gimnasio por ID de entrenador
const listarGimnasioPorIdEntrenador = (idEntrenador) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryGimnasio = `
                SELECT g.* 
                FROM tb_gimnasio g
                JOIN tb_entrenador_gimnasio i ON g.id_gimnasio = i.id_gimnasio
                WHERE i.id_entrenador = ?
            `;

            connection.query(queryGimnasio, [idEntrenador], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve los gimnasios asociados al entrenador
            });
        });
    });
};

// 3. Listar gimnasio por ID de atleta
const listarGimnasioPorIdAtleta = (idAtleta) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryGimnasio = `
                SELECT g.* 
                FROM tb_gimnasio g
                JOIN tb_atleta a ON g.id_gimnasio = a.id_gimnasio
                WHERE a.id_atleta = ?
            `;

            connection.query(queryGimnasio, [idAtleta], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve los gimnasios asociados al atleta
            });
        });
    });
};

module.exports = {
    listarGimnasioPorIdEntrenador,
    listarGimnasios,
    listarGimnasioPorIdAtleta
};