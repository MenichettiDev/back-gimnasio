const conexion = require('../config/conexion');

// 1. Listar Grupos Musculares (Ya implementado)
const listarGruposMusculares = () => {
    return new Promise((resolve, reject) => {
        const queryGrupoMusculares = 'SELECT * FROM tb_grupos_musculares'; 
        conexion.query(queryGrupoMusculares, (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); 
        });
    });
};

// 2. Obtener un Grupo Muscular por ID
const obtenerGrupoMuscularPorId = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM tb_grupos_musculares WHERE id_grupo_muscular = ?';
        conexion.query(query, [id], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados[0]); // Devuelve el primer resultado (único)
        });
    });
};

// 3. Crear un Nuevo Grupo Muscular
const crearGrupoMuscular = (nombre) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO tb_grupos_musculares (nombre) VALUES (?)';
        conexion.query(query, [nombre], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados.insertId); // Devuelve el ID del nuevo grupo muscular
        });
    });
};

// 4. Actualizar un Grupo Muscular Existente
const actualizarGrupoMuscular = (id, nombre) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE tb_grupos_musculares SET nombre = ? WHERE id_grupo_muscular = ?';
        conexion.query(query, [nombre, id], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados.affectedRows); // Devuelve el número de filas afectadas
        });
    });
};

// 5. Eliminar un Grupo Muscular
const eliminarGrupoMuscular = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM tb_grupos_musculares WHERE id_grupo_muscular = ?';
        conexion.query(query, [id], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados.affectedRows); // Devuelve el número de filas afectadas
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