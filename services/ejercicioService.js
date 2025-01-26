const conexion = require('../config/conexion');


const listarEjercicioPorGrupoMuscular = ( grupoMuscular ) => {
    return new Promise((resolve, reject) => {
        const queryEjercicios = 'SELECT * FROM tb_ejercicios e WHERE e.id_grupo_muscular = ?'; // Filtramos por id_entrenador
        conexion.query(queryEjercicios, [grupoMuscular], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); // Devuelve los atletas que están relacionados con el id_entrenador
        });
    });
};

const listarEjercicioById = ( id_ejercicio ) => {
    return new Promise((resolve, reject) => {
        const queryEjercicios = 'SELECT * FROM tb_ejercicios e WHERE e.id_ejercicio = ?'; 
        conexion.query(queryEjercicios, [id_ejercicio], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); // Devuelve los atletas que están relacionados con el id_entrenador
        });
    });
};

const crearEjercicio = (nuevoEjercicio) => {
    return new Promise((resolve, reject) => {
        const queryInsertEjercicio = `
            INSERT INTO tb_ejercicios (
                id_entrenador, 
                id_grupo_muscular, 
                nombre, 
                img_1, 
                img_2, 
                img_3, 
                descripcion, 
                link_video
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `; // Inserta un nuevo ejercicio en la tabla

        const { 
            id_entrenador, 
            id_grupo_muscular, 
            nombre, 
            img_1, 
            img_2, 
            img_3, 
            descripcion, 
            link_video 
        } = nuevoEjercicio;

        conexion.query(queryInsertEjercicio, [id_entrenador, id_grupo_muscular, nombre, img_1, img_2, img_3, descripcion, link_video], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados.insertId); // Devuelve el ID del nuevo ejercicio creado
        });
    });
};


const actualizarEjercicio = ( ejercicio ) => {
    return new Promise((resolve, reject) => {
        const queryUpdateEjercicio = `
            UPDATE tb_ejercicios
            SET 
                id_entrenador = ?,
                id_grupo_muscular = ?,
                nombre = ?,
                img_1 = ?,
                img_2 = ?,
                img_3 = ?,
                descripcion = ?,
                link_video = ?
            WHERE id_ejercicio = ?;
        `; // Actualizamos todos los campos relevantes

        const { id_entrenador, id_grupo_muscular, nombre, img_1, img_2, img_3, descripcion, link_video, id_ejercicio } = ejercicio;

        conexion.query(queryUpdateEjercicio, [id_entrenador, id_grupo_muscular, nombre, img_1, img_2, img_3, descripcion, link_video, id_ejercicio], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); // Responde con el resultado de la actualización
        });
    });
};


const eliminarEjercicioPorId = ( idEjercicio ) => {
    return new Promise((resolve, reject) => {
        const queryDeleteEjercicio = 'DELETE FROM tb_ejercicios WHERE id_ejercicio = ?';

        conexion.query(queryDeleteEjercicio, [idEjercicio], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); // Devuelve el resultado de la eliminación
        });
    });
};


module.exports = {
    listarEjercicioPorGrupoMuscular,
    listarEjercicioById,
    actualizarEjercicio,
    eliminarEjercicioPorId,
    crearEjercicio

};