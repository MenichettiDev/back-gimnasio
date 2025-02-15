const conexion = require('../config/conexion');

const listarFormasPago = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM tb_forma_pago'; 
        conexion.query(query, (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); 
        });
    });
};

const obtenerFormaPagoPorId = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM tb_forma_pago WHERE id_forma_pago = ?'; 
        conexion.query(query, [id], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados[0]); 
        });
    });
};

const crearFormaPago = (nombre) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO tb_forma_pago (nombre) VALUES (?)'; 
        conexion.query(query, [nombre], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados.insertId); 
        });
    });
};

const actualizarFormaPago = (id, nombre) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE tb_forma_pago SET nombre = ? WHERE id_forma_pago = ?'; 
        conexion.query(query, [nombre, id], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados.affectedRows); 
        });
    });
};

const eliminarFormaPago = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM tb_forma_pago WHERE id_forma_pago = ?'; 
        conexion.query(query, [id], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados.affectedRows); 
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