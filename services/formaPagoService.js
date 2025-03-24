const conexion = require('../config/conexion');
//Pool aplicado
// 1. Listar todas las formas de pago
const listarFormasPago = () => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT * FROM tb_forma_pago';
            connection.query(query, (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve todas las formas de pago
            });
        });
    });
};

// 2. Obtener una forma de pago por ID
const obtenerFormaPagoPorId = (id) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT * FROM tb_forma_pago WHERE id_forma_pago = ?';
            connection.query(query, [id], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados[0]); // Devuelve la primera coincidencia
            });
        });
    });
};

// 3. Crear una nueva forma de pago
const crearFormaPago = (nombre) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'INSERT INTO tb_forma_pago (nombre) VALUES (?)';
            connection.query(query, [nombre], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados.insertId); // Devuelve el ID de la nueva forma de pago
            });
        });
    });
};

// 4. Actualizar una forma de pago existente
const actualizarFormaPago = (id, nombre) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'UPDATE tb_forma_pago SET nombre = ? WHERE id_forma_pago = ?';
            connection.query(query, [nombre, id], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados.affectedRows); // Devuelve el número de filas afectadas
            });
        });
    });
};

// 5. Eliminar una forma de pago por ID
const eliminarFormaPago = (id) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'DELETE FROM tb_forma_pago WHERE id_forma_pago = ?';
            connection.query(query, [id], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados.affectedRows); // Devuelve el número de filas afectadas
            });
        });
    });
};

module.exports = {
    listarFormasPago,
    obtenerFormaPagoPorId,
    crearFormaPago,
    actualizarFormaPago,
    eliminarFormaPago
};