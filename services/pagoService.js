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

            connection.beginTransaction((error) => {
                if (error) {
                    connection.release();
                    return reject(error);
                }

                const queryInsertPago = `
                    INSERT INTO tb_pago (
                        id_persona, 
                        fecha_pago, 
                        monto, 
                        id_forma_pago,
                        concepto,
                        mp_payment_id,
                        mp_status,
                        mp_subscription_id
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
                `;

                const { id_persona, fecha_pago, monto, id_forma_pago, concepto, mp_payment_id, mp_status, mp_subscription_id } = nuevoPago;

                connection.query(
                    queryInsertPago,
                    [id_persona, fecha_pago, monto, id_forma_pago, concepto, mp_payment_id, mp_status, mp_subscription_id],
                    (error, resultados) => {
                        if (error) {
                            connection.rollback(() => {
                                connection.release();
                                reject(error);
                            });
                            return;
                        }

                        const nuevoPagoId = resultados.insertId;

                        // Función para actualizar la tabla correspondiente
                        const updates = [];
                        if (id_persona) {
                            updates.push(new Promise((res, rej) => {
                                const query = `
                                    UPDATE tb_persona 
                                    SET ultimo_pago = ?
                                    WHERE id_persona = ?;
                                `;
                                connection.query(query, [fecha_pago, id_persona], (err) => {
                                    if (err) return rej(err);
                                    res();
                                });
                            }));
                        }


                        Promise.all(updates)
                            .then(() => {
                                connection.commit((error) => {
                                    if (error) {
                                        connection.rollback(() => {
                                            connection.release();
                                            reject(error);
                                        });
                                        return;
                                    }
                                    connection.release();
                                    resolve(nuevoPagoId);
                                });
                            })
                            .catch((updateError) => {
                                connection.rollback(() => {
                                    connection.release();
                                    reject(updateError);
                                });
                            });
                    }
                );
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