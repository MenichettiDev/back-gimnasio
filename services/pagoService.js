const conexion = require('../config/conexion');

//estos metodos ya estan configurados para pool

// 1. Obtener todos los pagos de un atleta específico
const obtenerPagosPorAtleta = (id_atleta) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT * FROM tb_pago WHERE id_atleta = ?';
            connection.query(query, [id_atleta], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados);
            });
        });
    });
};

// 2. Obtener un pago por su ID
const obtenerPagoPorId = (id_pago) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT * FROM tb_pago WHERE id_pago = ?';
            connection.query(query, [id_pago], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados[0]); // Devuelve el primer resultado (único pago)
            });
        });
    });
};

// 3. Crear un nuevo pago
const crearPago = (nuevoPago) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            // Iniciar una transacción
            connection.beginTransaction((error) => {
                if (error) {
                    connection.release(); // Liberar la conexión
                    return reject(error);
                }

                const queryInsertPago = `
                    INSERT INTO tb_pago (
                        id_atleta, 
                        id_membresia, 
                        fecha_pago, 
                        monto, 
                        id_forma_pago
                    ) VALUES (?, ?, ?, ?, ?);
                `;

                const { id_atleta, id_membresia, fecha_pago, monto, id_forma_pago } = nuevoPago;

                // Insertar el pago
                connection.query(queryInsertPago, [id_atleta, id_membresia, fecha_pago, monto, id_forma_pago], (error, resultados) => {
                    if (error) {
                        connection.rollback(() => {
                            connection.release(); // Liberar la conexión
                            reject(error);
                        });
                        return;
                    }

                    const nuevoPagoId = resultados.insertId;

                    const queryUpdateAtleta = `
                        UPDATE tb_atleta 
                        SET ultimo_pago = ?, estado = "activo"
                        WHERE id_atleta = ?;
                    `;

                    // Actualizar la fecha de último pago
                    connection.query(queryUpdateAtleta, [fecha_pago, id_atleta], (error, resultados) => {
                        if (error) {
                            connection.rollback(() => {
                                connection.release(); // Liberar la conexión
                                reject(error);
                            });
                            return;
                        }

                        // Si todo está bien, hacer commit
                        connection.commit((error) => {
                            if (error) {
                                connection.rollback(() => {
                                    connection.release(); // Liberar la conexión
                                    reject(error);
                                });
                                return;
                            }

                            connection.release(); // Liberar la conexión
                            resolve(nuevoPagoId); // Resolver con el ID del nuevo pago
                        });
                    });
                });
            });
        });
    });
};

// 4. Actualizar un pago existente
const actualizarPago = (pago) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = `
                UPDATE tb_pago
                SET 
                    id_atleta = ?,
                    id_membresia = ?,
                    fecha_pago = ?,
                    monto = ?,
                    id_forma_pago = ?
                WHERE id_pago = ?;
            `;

            const { id_atleta, id_membresia, fecha_pago, monto, id_forma_pago, id_pago } = pago;

            connection.query(query, [id_atleta, id_membresia, fecha_pago, monto, id_forma_pago, id_pago], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve el resultado de la actualización
            });
        });
    });
};

// 5. Eliminar un pago por su ID
const eliminarPagoPorId = (id_pago) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'DELETE FROM tb_pago WHERE id_pago = ?';
            connection.query(query, [id_pago], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve el resultado de la eliminación
            });
        });
    });
};


// 6. Obtener todos los pagos realizados en una fecha específica
const obtenerPagosPorFecha = (fecha) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT * FROM tb_pago WHERE DATE(fecha_pago) = ?';
            connection.query(query, [fecha], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados);
            });
        });
    });
};

// 7. Obtener el total de pagos realizados por un atleta
const obtenerTotalPagosPorAtleta = (id_atleta) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT SUM(monto) AS total_pagos FROM tb_pago WHERE id_atleta = ?';
            connection.query(query, [id_atleta], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados[0].total_pagos || 0); // Devuelve el total de pagos o 0 si no hay pagos
            });
        });
    });
};

module.exports = {
    obtenerPagosPorAtleta,
    obtenerPagoPorId,
    crearPago,
    actualizarPago,
    eliminarPagoPorId,
    obtenerPagosPorFecha,
    obtenerTotalPagosPorAtleta
};