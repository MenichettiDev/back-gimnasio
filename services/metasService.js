const conexion = require('../config/conexion');
//pool
// 1. Listar todas las metas
const listarMetas = () => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT * FROM tb_metas';
            connection.query(query, (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve todas las metas
            });
        });
    });
};

// 2. Obtener una meta por ID
const obtenerMetaPorId = (id) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT * FROM tb_metas WHERE id_meta = ?';
            connection.query(query, [id], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados[0]); // Devuelve la primera coincidencia (única)
            });
        });
    });
};

// 3. Crear una nueva meta
const crearMeta = (id_atleta, descripcion, tipo_meta, valor_objetivo, fecha_establecimiento, fecha_vencimiento, estado) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = `
                INSERT INTO tb_metas 
                (id_atleta, descripcion, tipo_meta, valor_objetivo, fecha_establecimiento, fecha_vencimiento, estado) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            connection.query(query, [id_atleta, descripcion, tipo_meta, valor_objetivo, fecha_establecimiento, fecha_vencimiento, estado], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados.insertId); // Devuelve el ID de la nueva meta
            });
        });
    });
};

// 4. Actualizar una meta existente
const actualizarMeta = (id, id_atleta, descripcion, tipo_meta, valor_objetivo, fecha_establecimiento, fecha_vencimiento, estado) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = `
                UPDATE tb_metas 
                SET id_atleta = ?, descripcion = ?, tipo_meta = ?, valor_objetivo = ?, fecha_establecimiento = ?, fecha_vencimiento = ?, estado = ? 
                WHERE id_meta = ?
            `;
            connection.query(query, [id_atleta, descripcion, tipo_meta, valor_objetivo, fecha_establecimiento, fecha_vencimiento, estado, id], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados.affectedRows); // Devuelve el número de filas afectadas
            });
        });
    });
};

// 5. Eliminar una meta
const eliminarMeta = (id) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'DELETE FROM tb_metas WHERE id_meta = ?';
            connection.query(query, [id], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados.affectedRows); // Devuelve el número de filas afectadas
            });
        });
    });
};

// 6. Listar metas por ID de atleta
const listarMetasPorIdAtleta = (id_atleta) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT * FROM tb_metas WHERE id_atleta = ?';
            connection.query(query, [id_atleta], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve todas las metas del atleta
            });
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