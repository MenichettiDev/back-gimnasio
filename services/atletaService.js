const conexion = require('../config/conexion');

const listarAtletas = () => {
    return new Promise((resolve, reject) => {
        const queryPersonas = 'SELECT * FROM tb_atleta a, tb_persona p where p.id_persona = a.id_persona'; 
        conexion.query(queryPersonas, (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); 
        });
    });
};

//arreglar esta consulta
const listarAtletasPorIdEntrenador = ( idEntrenador ) => {
    return new Promise((resolve, reject) => {
        const queryAtletas = 'SELECT * FROM tb_atleta a, tb_persona p WHERE a.id_entrenador = ?'; 
        conexion.query(queryAtletas, [idEntrenador], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); 
        });
    });
};


module.exports = {
    listarAtletas,
    listarAtletasPorIdEntrenador,

};