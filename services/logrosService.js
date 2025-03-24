const conexion = require('../config/conexion');
//Pool aplicado
// 1. Listar todos los logros
const listarLogros = () => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT * FROM tb_logros';
            connection.query(query, (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve todos los logros
            });
        });
    });
};

// 2. Obtener un logro por ID
const obtenerLogroPorId = (id) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT * FROM tb_logros WHERE id_logro = ?';
            connection.query(query, [id], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados[0]); // Devuelve la primera coincidencia (única)
            });
        });
    });
};

// 3. Crear un nuevo logro
const crearLogro = (id_atleta, nombre_logro, descripcion_logro, fecha) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = `
                INSERT INTO tb_logros 
                (id_atleta, nombre_logro, descripcion_logro, fecha) 
                VALUES (?, ?, ?, ?)
            `;
            connection.query(query, [id_atleta, nombre_logro, descripcion_logro, fecha], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados.insertId); // Devuelve el ID del nuevo logro
            });
        });
    });
};

// 4. Actualizar un logro existente
const actualizarLogro = (id, id_atleta, nombre_logro, descripcion_logro, fecha) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = `
                UPDATE tb_logros 
                SET id_atleta = ?, nombre_logro = ?, descripcion_logro = ?, fecha = ? 
                WHERE id_logro = ?
            `;
            connection.query(query, [id_atleta, nombre_logro, descripcion_logro, fecha, id], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados.affectedRows); // Devuelve el número de filas afectadas
            });
        });
    });
};

// 5. Eliminar un logro
const eliminarLogro = (id) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'DELETE FROM tb_logros WHERE id_logro = ?';
            connection.query(query, [id], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados.affectedRows); // Devuelve el número de filas afectadas
            });
        });
    });
};

// 6. Listar logros por ID de atleta
const listarLogrosPorIdAtleta = (id_atleta) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT * FROM tb_logros WHERE id_atleta = ?';
            connection.query(query, [id_atleta], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve todos los logros del atleta
            });
        });
    });
};

module.exports = {
    listarLogros,
    obtenerLogroPorId,
    crearLogro,
    actualizarLogro,
    eliminarLogro,
    listarLogrosPorIdAtleta,
};