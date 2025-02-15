const conexion = require('../config/conexion');

const listarGimnasios = () => {
    return new Promise((resolve, reject) => {
        const queryGimnasios = 'SELECT * FROM tb_gimnasio';
        conexion.query(queryGimnasios, (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); 
        });
    });
};

//arreglar esta consulta
const listarGimnasioPorIdEntrenador = ( idEntrenador ) => {
    return new Promise((resolve, reject) => {
        const queryGimnasio = 'SELECT * FROM tb_gimnasio g, tb_entrenador_gimnasio i WHERE i.id_entrenador = ? and g.id_gimnasio = i.id_gimnasio'; 
        conexion.query(queryGimnasio, [idEntrenador], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); 
        });
    });
};

const listarGimnasioPorIdAtleta = ( idAtleta ) => {
    return new Promise((resolve, reject) => {
        const queryGimnasio = 'SELECT * FROM tb_gimnasio g, tb_atleta a WHERE a.id_atleta = ? and g.id_gimnasio = a.id_gimnasio'; 
        conexion.query(queryGimnasio, [idAtleta], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); 
        });
    });
};


module.exports = {
listarGimnasioPorIdEntrenador,
listarGimnasios,
listarGimnasioPorIdAtleta

};