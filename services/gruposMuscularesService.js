const conexion = require('../config/conexion');

const listarGruposMusculares = () => {
    return new Promise((resolve, reject) => {
        const queryGrupoMusculares = 'SELECT * FROM tb_grupos_musculares'; 
        conexion.query(queryGrupoMusculares, (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); 
        });
    });
};



module.exports = {
    listarGruposMusculares

};