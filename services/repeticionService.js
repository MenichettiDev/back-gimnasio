const conexion = require('../config/conexion');
// pool
// 1. Listar todas las repeticiones
const listarRepeticiones = () => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT * FROM tb_repeticion';
            connection.query(query, (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve todas las repeticiones
            });
        });
    });
};

// 2. Obtener una repetición por ID
const obtenerRepeticionPorId = (id) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT * FROM tb_repeticion WHERE id_repeticion = ?';
            connection.query(query, [id], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados[0]); // Devuelve la primera coincidencia (única)
            });
        });
    });
};

// 3. Crear una nueva repetición
const crearRepeticion = (nombre, frecuencia, comentario) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'INSERT INTO tb_repeticion (nombre, frecuencia, comentario) VALUES (?, ?, ?)';
            connection.query(query, [nombre, frecuencia, comentario], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados.insertId); // Devuelve el ID de la nueva repetición
            });
        });
    });
};

// 4. Actualizar una repetición existente
const actualizarRepeticion = (id, nombre, frecuencia, comentario) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'UPDATE tb_repeticion SET nombre = ?, frecuencia = ?, comentario = ? WHERE id_repeticion = ?';
            connection.query(query, [nombre, frecuencia, comentario, id], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados.affectedRows); // Devuelve el número de filas afectadas
            });
        });
    });
};

// 5. Eliminar una repetición
const eliminarRepeticion = (id) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'DELETE FROM tb_repeticion WHERE id_repeticion = ?';
            connection.query(query, [id], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados.affectedRows); // Devuelve el número de filas afectadas
            });
        });
    });
};

module.exports = {
    listarRepeticiones,
    obtenerRepeticionPorId,
    crearRepeticion,
    actualizarRepeticion,
    eliminarRepeticion,
};