const conexion = require('../config/conexion');

// Solicitar relación atleta-entrenador
exports.solicitarAtletaEntrenador = (id_atleta, id_entrenador) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);
            const query = 'INSERT INTO tb_atleta_entrenador (id_atleta, id_entrenador, activo) VALUES (?, ?, 0)';
            connection.query(query, [id_atleta, id_entrenador], (error, resultados) => {
                connection.release();
                if (error) return reject(error);
                resolve({ success: true });
            });
        });
    });
};

// Solicitar relación atleta-gimnasio OK
exports.solicitarAtletaGimnasio = (id_atleta, id_gimnasio) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);
            const query = 'INSERT INTO tb_atleta_gimnasio (id_atleta, id_gimnasio, activo) VALUES (?, ?, 0)';
            connection.query(query, [id_atleta, id_gimnasio], (error, resultados) => {
                connection.release();
                if (error) return reject(error);
                resolve({ success: true });
            });
        });
    });
};

// Solicitar relación entrenador-gimnasio
exports.solicitarEntrenadorGimnasio = (id_entrenador, id_gimnasio) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);
            const query = 'INSERT INTO tb_entrenador_gimnasio (id_entrenador, id_gimnasio, activo) VALUES (?, ?, 0)';
            connection.query(query, [id_entrenador, id_gimnasio], (error, resultados) => {
                connection.release();
                if (error) return reject(error);
                resolve({ success: true });
            });
        });
    });
};

// Obtener solicitudes pendientes para entrenador
exports.getSolicitudesPendientesEntrenador = (id_entrenador) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);
            const query = `SELECT ae.id, p.nombre AS nombreSolicitante, 'atleta-entrenador' AS tipo
                           FROM tb_atleta_entrenador ae
                           JOIN tb_atleta a ON ae.id_atleta = a.id_atleta
                           JOIN tb_persona p ON a.id_persona = p.id_persona
                           WHERE ae.id_entrenador = ? AND ae.activo = 0`;
            connection.query(query, [id_entrenador], (error, rows) => {
                connection.release();
                if (error) return reject(error);
                resolve(rows);
            });
        });
    });
};

// Obtener solicitudes pendientes para atleta
exports.getSolicitudesPendientesAtleta = (id_atleta) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);
            // Atleta puede tener solicitudes de entrenador y gimnasio
            const queryEntrenador = `SELECT ae.id, e.nombre AS nombreSolicitante, 'entrenador' AS tipo
                                     FROM tb_atleta_entrenador ae
                                     JOIN tb_entrenador e ON ae.id_entrenador = e.id_entrenador
                                     WHERE ae.id_atleta = ? AND ae.activo = 0`;
            connection.query(queryEntrenador, [id_atleta], (error, entrenadorRows) => {
                if (error) return connection.release(), reject(error);
                const queryGimnasio = `SELECT ag.id, g.nombre AS nombreSolicitante, 'gimnasio' AS tipo
                                       FROM tb_atleta_gimnasio ag
                                       JOIN tb_gimnasio g ON ag.id_gimnasio = g.id_gimnasio
                                       WHERE ag.id_atleta = ? AND ag.activo = 0`;
                connection.query(queryGimnasio, [id_atleta], (error, gimnasioRows) => {
                    connection.release();
                    if (error) return reject(error);
                    resolve([...entrenadorRows, ...gimnasioRows]);
                });
            });
        });
    });
};

// Obtener solicitudes pendientes para gimnasio
exports.getSolicitudesPendientesGimnasio = (id_gimnasio) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);
            const queryAtleta = `SELECT ag.id, p.nombre AS nombreSolicitante, 'atleta-gimnasio' AS tipo
                                 FROM tb_atleta_gimnasio ag
                                 JOIN tb_atleta a ON ag.id_atleta = a.id_atleta
                                 JOIN tb_persona p ON a.id_persona = p.id_persona
                                 WHERE ag.id_gimnasio = ? AND ag.activo = 0`;
            connection.query(queryAtleta, [id_gimnasio], (error, atletaRows) => {
                if (error) return connection.release(), reject(error);
                const queryEntrenador = `SELECT eg.id, p.nombre AS nombreSolicitante, 'entrenador-gimnasio' AS tipo
                                         FROM tb_entrenador_gimnasio eg
                                         JOIN tb_entrenador e ON eg.id_entrenador = e.id_entrenador
                                         JOIN tb_persona p ON e.id_persona = p.id_persona
                                         WHERE eg.id_gimnasio = ? AND eg.activo = 0`;
                connection.query(queryEntrenador, [id_gimnasio], (error, entrenadorRows) => {
                    connection.release();
                    if (error) return reject(error);
                    resolve([...atletaRows, ...entrenadorRows]);
                });
            });
        });
    });
};

// Aceptar/rechazar solicitud atleta-entrenador
exports.responderSolicitudAtletaEntrenador = (id, activo) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);
            const query = 'UPDATE tb_atleta_entrenador SET activo = ? WHERE id = ?';
            connection.query(query, [activo ? 1 : -1, id], (error, resultados) => {
                connection.release();
                if (error) return reject(error);
                resolve({ success: true });
            });
        });
    });
};

// Aceptar/rechazar solicitud atleta-gimnasio
exports.responderSolicitudAtletaGimnasio = (id, activo) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);
            const query = 'UPDATE tb_atleta_gimnasio SET activo = ? WHERE id = ?';
            connection.query(query, [activo ? 1 : -1, id], (error, resultados) => {
                connection.release();
                if (error) return reject(error);
                resolve({ success: true });
            });
        });
    });
};

// Aceptar/rechazar solicitud entrenador-gimnasio
exports.responderSolicitudEntrenadorGimnasio = (id, activo) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);
            const query = 'UPDATE tb_entrenador_gimnasio SET activo = ? WHERE id = ?';
            connection.query(query, [activo ? 1 : -1, id], (error, resultados) => {
                connection.release();
                if (error) return reject(error);
                resolve({ success: true });
            });
        });
    });
};
