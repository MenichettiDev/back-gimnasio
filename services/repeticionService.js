const conexion = require('../config/conexion');

const listarRepeticiones = () => {
    return new Promise((resolve, reject) => {
        const queryRepeticion = 'SELECT * FROM tb_repeticion '; 
        conexion.query(queryRepeticion, (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); 
        });
    });
};

module.exports = {
    listarRepeticiones

};