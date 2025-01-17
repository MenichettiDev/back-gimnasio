const conexion = require('../config/conexion');

const listarRutinasFree = () => {
    return new Promise((resolve, reject) => {
        const queryRutina = `SELECT * FROM tb_rutina where id_rutina < 13`; 
        conexion.query(queryRutina, (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); 
        });
    });
};

const listarRutinaByIdCreador = ( id_persona ) => {
    return new Promise((resolve, reject) => {
        const queryRutina = `SELECT * FROM tb_rutina where id_creador = ?`; 
        conexion.query(queryRutina, [id_persona], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); 
        });
    });
};

const listarRutinaByIdAtleta = ( id_atleta ) => {
    return new Promise((resolve, reject) => {
        const queryRutina = `SELECT * FROM tb_rutina r, tb_rutina_atleta i 
        where i.id_atleta = ? and r.id_rutina = i.id_rutina`; 
        conexion.query(queryRutina, [id_atleta], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); 
        });
    });
};

module.exports = {
    listarRutinasFree,
    listarRutinaByIdCreador,
    listarRutinaByIdAtleta

};