const conexion = require('../config/conexion');
//pool aplicado
// 1. Listar ejercicios por grupo muscular
const listarEjercicioPorGrupoMuscular = (grupoMuscular) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryEjercicios = 'SELECT * FROM tb_ejercicios e WHERE e.id_grupo_muscular = ?';
            connection.query(queryEjercicios, [grupoMuscular], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve los ejercicios filtrados por grupo muscular
            });
        });
    });
};

// 2. Listar ejercicio por ID
const listarEjercicioById = (id_ejercicio) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryEjercicios = 'SELECT * FROM tb_ejercicios e WHERE e.id_ejercicio = ?';
            connection.query(queryEjercicios, [id_ejercicio], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve el ejercicio correspondiente al ID
            });
        });
    });
};

// 3. Crear un nuevo ejercicio
const crearEjercicio = (nuevoEjercicio) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryInsertEjercicio = `
                INSERT INTO tb_ejercicios (
                    id_grupo_muscular, 
                    nombre, 
                    img_1, 
                    img_2, 
                    img_3, 
                    descripcion, 
                    link_video
                ) VALUES (?, ?, ?, ?, ?, ?, ?);
            `;

            const {
                id_grupo_muscular,
                nombre,
                img_1,
                img_2,
                img_3,
                descripcion,
                link_video
            } = nuevoEjercicio;

            connection.query(queryInsertEjercicio, [id_grupo_muscular, nombre, img_1, img_2, img_3, descripcion, link_video], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                if (!resultados || typeof resultados.insertId === 'undefined') {
                    return reject(new Error('No se devolvió insertId al crear ejercicio'));
                }
                resolve(resultados.insertId); // Devuelve el ID del nuevo ejercicio creado
            });
        });
    });
};

// 4. Actualizar un ejercicio existente
const actualizarEjercicio = (ejercicio) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryUpdateEjercicio = `
                UPDATE tb_ejercicios
                SET 
                    id_grupo_muscular = ?,
                    nombre = ?,
                    img_1 = ?,
                    img_2 = ?,
                    img_3 = ?,
                    descripcion = ?,
                    link_video = ?
                WHERE id_ejercicio = ?;
            `;

            const { id_grupo_muscular, nombre, img_1, img_2, img_3, descripcion, link_video, id_ejercicio } = ejercicio;

            connection.query(queryUpdateEjercicio, [id_grupo_muscular, nombre, img_1, img_2, img_3, descripcion, link_video, id_ejercicio], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Responde con el resultado de la actualización
            });
        });
    });
};

// 5. Eliminar un ejercicio por su ID
const eliminarEjercicioPorId = (idEjercicio) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryDeleteEjercicio = 'DELETE FROM tb_ejercicios WHERE id_ejercicio = ?';

            connection.query(queryDeleteEjercicio, [idEjercicio], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve el resultado de la eliminación
            });
        });
    });
};

module.exports = {
    listarEjercicioPorGrupoMuscular,
    listarEjercicioById,
    crearEjercicio,
    actualizarEjercicio,
    eliminarEjercicioPorId,
};