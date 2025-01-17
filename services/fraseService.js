const conexion = require('../config/conexion');


const fraseAleatoria = () => {
    return new Promise((resolve, reject) => {
        const queryFraseAleatoria = `SELECT * FROM tb_frases ORDER BY RAND() LIMIT 1`; 
        conexion.query(queryFraseAleatoria, (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados);  // Solo devolvemos la primera frase (única fila aleatoria)
        });
    });
};


module.exports = {
    fraseAleatoria

};