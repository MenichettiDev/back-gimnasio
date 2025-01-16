const conexion = require('../config/conexion');

//arreglar esta consulta
const listarEjercicioPorGrupoMuscular = ( grupoMuscular ) => {
    return new Promise((resolve, reject) => {
        const queryAtletas = 'SELECT * FROM tb_ejercicios e WHERE e.id_grupo_muscular = ?'; // Filtramos por id_entrenador
        conexion.query(queryAtletas, [grupoMuscular], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); // Devuelve los atletas que están relacionados con el id_entrenador
        });
    });
};


module.exports = {
    listarEjercicioPorGrupoMuscular

};