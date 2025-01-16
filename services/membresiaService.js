const conexion = require('../config/conexion');


const listarMembresiasByIdGimnasio = (id_gimnasio) => {
    return new Promise((resolve, reject) => {
        const queryMembresia = `SELECT * FROM tb_membresia m 
        WHERE m.id_gimnasio = ?`;
        conexion.query(queryMembresia, [id_gimnasio], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados);
        });
    });
};

const listarMembresias = () => {
    return new Promise((resolve, reject) => {
        const queryMembresia = `SELECT * FROM tb_membresia`; 
        conexion.query(queryMembresia, (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); 
        });
    });
};


module.exports = {
    listarMembresias,
    listarMembresiasByIdGimnasio

};