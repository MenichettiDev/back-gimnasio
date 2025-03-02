const conexion = require('../config/conexion');

// 1. Listar todas las metas
const listarMetas = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM tb_metas';
        conexion.query(query, (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados);
        });
    });
};

// 2. Obtener una meta por ID
const obtenerMetaPorId = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM tb_metas WHERE id_meta = ?';
        conexion.query(query, [id], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados[0]); // Devuelve la primera coincidencia (única)
        });
    });
};

// 3. Crear una nueva meta
const crearMeta = (id_atleta, descripcion, tipo_meta, valor_objetivo, fecha_establecimiento, fecha_vencimiento, estado) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO tb_metas 
            (id_atleta, descripcion, tipo_meta, valor_objetivo, fecha_establecimiento, fecha_vencimiento, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        conexion.query(query, [id_atleta, descripcion, tipo_meta, valor_objetivo, fecha_establecimiento, fecha_vencimiento, estado], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados.insertId); // Devuelve el ID de la nueva meta
        });
    });
};

// 4. Actualizar una meta existente
const actualizarMeta = (id, id_atleta, descripcion, tipo_meta, valor_objetivo, fecha_establecimiento, fecha_vencimiento, estado) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE tb_metas 
            SET id_atleta = ?, descripcion = ?, tipo_meta = ?, valor_objetivo = ?, fecha_establecimiento = ?, fecha_vencimiento = ?, estado = ? 
            WHERE id_meta = ?
        `;
        conexion.query(query, [id_atleta, descripcion, tipo_meta, valor_objetivo, fecha_establecimiento, fecha_vencimiento, estado, id], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados.affectedRows); // Devuelve el número de filas afectadas
        });
    });
};

// 5. Eliminar una meta
const eliminarMeta = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM tb_metas WHERE id_meta = ?';
        conexion.query(query, [id], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados.affectedRows); // Devuelve el número de filas afectadas
        });
    });
};

// 6. Listar metas por ID de atleta
const listarMetasPorIdAtleta = (id_atleta) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM tb_metas WHERE id_atleta = ?';
        conexion.query(query, [id_atleta], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); // Devuelve todas las metas del atleta
        });
    });
};

module.exports = {
    listarMetas,
    obtenerMetaPorId,
    crearMeta,
    actualizarMeta,
    eliminarMeta,
    listarMetasPorIdAtleta,
};