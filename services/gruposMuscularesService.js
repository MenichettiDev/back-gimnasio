const conexion = require('../config/conexion');
//Pool aplicado
// 1. Listar Grupos Musculares
const listarGruposMusculares = () => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryGrupoMusculares = 'SELECT * FROM tb_grupos_musculares';
            connection.query(queryGrupoMusculares, (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve todos los grupos musculares
            });
        });
    });
};

// 2. Obtener un Grupo Muscular por ID
const obtenerGrupoMuscularPorId = (id) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT * FROM tb_grupos_musculares WHERE id_grupo_muscular = ?';
            connection.query(query, [id], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados[0]); // Devuelve el primer resultado (único)
            });
        });
    });
};

// 3. Crear un Nuevo Grupo Muscular
const crearGrupoMuscular = (nombre) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'INSERT INTO tb_grupos_musculares (nombre) VALUES (?)';
            connection.query(query, [nombre], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados.insertId); // Devuelve el ID del nuevo grupo muscular
            });
        });
    });
};

// 4. Actualizar un Grupo Muscular Existente
const actualizarGrupoMuscular = (id, nombre) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'UPDATE tb_grupos_musculares SET nombre = ? WHERE id_grupo_muscular = ?';
            connection.query(query, [nombre, id], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados.affectedRows); // Devuelve el número de filas afectadas
            });
        });
    });
};

// 5. Eliminar un Grupo Muscular
const eliminarGrupoMuscular = (id) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'DELETE FROM tb_grupos_musculares WHERE id_grupo_muscular = ?';
            connection.query(query, [id], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados.affectedRows); // Devuelve el número de filas afectadas
            });
        });
    });
};

module.exports = {
    listarGruposMusculares,
    obtenerGrupoMuscularPorId,
    crearGrupoMuscular,
    actualizarGrupoMuscular,
    eliminarGrupoMuscular
};