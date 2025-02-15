const conexion = require('../config/conexion');

// 1. Obtener todos los pagos de un atleta específico
const obtenerPagosPorAtleta = (id_atleta) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM tb_pago WHERE id_atleta = ?';
        conexion.query(query, [id_atleta], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados);
        });
    });
};

// 2. Obtener un pago por su ID
const obtenerPagoPorId = (id_pago) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM tb_pago WHERE id_pago = ?';
        conexion.query(query, [id_pago], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados[0]); // Devuelve el primer resultado (único pago)
        });
    });
};

// 3. Crear un nuevo pago
const crearPago = (nuevoPago) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO tb_pago (
                id_atleta, 
                id_membresia, 
                fecha_pago, 
                monto, 
                id_forma_pago
            ) VALUES (?, ?, ?, ?, ?);
        `;

        const { id_atleta, id_membresia, fecha_pago, monto, id_forma_pago } = nuevoPago;

        conexion.query(query, [id_atleta, id_membresia, fecha_pago, monto, id_forma_pago], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados.insertId); // Devuelve el ID del nuevo pago creado
        });
    });
};

// 4. Actualizar un pago existente
const actualizarPago = (pago) => {
    return new Promise((resolve, reject) => {
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

        conexion.query(query, [id_atleta, id_membresia, fecha_pago, monto, id_forma_pago, id_pago], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); // Devuelve el resultado de la actualización
        });
    });
};

// 5. Eliminar un pago por su ID
const eliminarPagoPorId = (id_pago) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM tb_pago WHERE id_pago = ?';
        conexion.query(query, [id_pago], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); // Devuelve el resultado de la eliminación
        });
    });
};

// 6. Obtener todos los pagos realizados en una fecha específica
const obtenerPagosPorFecha = (fecha) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM tb_pago WHERE DATE(fecha_pago) = ?';
        conexion.query(query, [fecha], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados);
        });
    });
};

// 7. Obtener el total de pagos realizados por un atleta
const obtenerTotalPagosPorAtleta = (id_atleta) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT SUM(monto) AS total_pagos FROM tb_pago WHERE id_atleta = ?';
        conexion.query(query, [id_atleta], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados[0].total_pagos || 0); // Devuelve el total de pagos o 0 si no hay pagos
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