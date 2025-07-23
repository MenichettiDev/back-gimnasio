const conexion = require('../config/conexion');
//pool aplicado
// 1. Obtener todos los entrenadores
const obtenerEntrenadores = () => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryPersonas = `
                SELECT * 
                FROM tb_entrenador 
                JOIN tb_persona ON tb_persona.id_persona = tb_entrenador.id_persona
            `;

            connection.query(queryPersonas, (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve los datos de todas las personas
            });
        });
    });
};

// 2. Obtener un entrenador por ID de persona
const obtenerEntrenadorPorPersona = (idPersona) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryEntrenador = 'SELECT * FROM tb_entrenador WHERE id_persona = ?';
            connection.query(queryEntrenador, [idPersona], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve el entrenador relacionado con la id_persona
            });
        });
    });
};

const crearEntrenador = (entrenadorData) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            connection.beginTransaction((error) => {
                if (error) {
                    connection.release();
                    return reject(error);
                }

                // Paso 1: Insertar en tb_persona
                const queryInsertPersona = `
                    INSERT INTO tb_persona (
                        dni, id_acceso, nombre, apellido, apodo, fecha_nacimiento,
                        celular, direccion, email, password, foto_archivo
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                const personaValues = [
                    entrenadorData.dni,
                    2,
                    entrenadorData.nombre,
                    entrenadorData.apellido,
                    entrenadorData.apodo || null,
                    entrenadorData.fecha_nacimiento,
                    entrenadorData.celular || null,
                    entrenadorData.direccion || null,
                    entrenadorData.email,
                    '$2b$10$5t2sv9aI6C9cbDtFlWp1iekWGMk.Addu7ha6dWzK50CC2Uc.1/Rzi',
                    null
                ];

                connection.query(queryInsertPersona, personaValues, (error, result) => {
                    if (error) {
                        return connection.rollback(() => {
                            connection.release();
                            reject(error);
                        });
                    }

                    const idPersona = result.insertId;

                    // Paso 2: Insertar en tb_entrenador
                    const queryInsertEntrenador = `
                        INSERT INTO tb_entrenador (
                            id_persona, fecha_ingreso, estado
                        ) VALUES (?, ?, ?)
                    `;
                    const entrenadorValues = [
                        idPersona,
                        entrenadorData.fecha_ingreso || new Date().toISOString().split('T')[0],
                        'activo'
                    ];

                    connection.query(queryInsertEntrenador, entrenadorValues, (error, resultEntrenador) => {
                        if (error) {
                            return connection.rollback(() => {
                                connection.release();
                                reject(error);
                            });
                        }

                        const idEntrenador = resultEntrenador.insertId;

                        // Paso 3: Insertar en tb_entrenador_gimnasio si hay gimnasios
                        if (entrenadorData.gimnasios && entrenadorData.gimnasios.length > 0) {
                            const queryInsertAsignaciones = `
                                INSERT INTO tb_entrenador_gimnasio (id_entrenador, id_gimnasio) VALUES ?
                            `;
                            const values = entrenadorData.gimnasios.map(id_gimnasio => [idEntrenador, id_gimnasio]);

                            connection.query(queryInsertAsignaciones, [values], (error) => {
                                if (error) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        reject(error);
                                    });
                                }

                                // Commit final
                                connection.commit((commitError) => {
                                    if (commitError) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            reject(commitError);
                                        });
                                    }
                                    connection.release();
                                    resolve({
                                        mensaje: "Entrenador creado exitosamente",
                                        id_persona: idPersona,
                                        id_entrenador: idEntrenador
                                    });
                                });
                            });
                        } else {
                            // Si no hay gimnasios, solo commit
                            connection.commit((commitError) => {
                                if (commitError) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        reject(commitError);
                                    });
                                }
                                connection.release();
                                resolve({
                                    mensaje: "Entrenador creado exitosamente",
                                    id_persona: idPersona,
                                    id_entrenador: idEntrenador
                                });
                            });
                        }
                    });
                });
            });
        });
    });
};

// Asignar gimnasios a un entrenador
const asignarGimnasios = async (id_entrenador, id_gimnasios) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            connection.beginTransaction((error) => {
                if (error) {
                    connection.release();
                    return reject(error);
                }

                // Eliminar asignaciones existentes para este entrenador
                const queryDeleteAsignaciones = `
                    DELETE FROM tb_entrenador_gimnasio WHERE id_entrenador = ?
                `;

                connection.query(queryDeleteAsignaciones, [id_entrenador], (error) => {
                    if (error) {
                        return connection.rollback(() => {
                            connection.release();
                            reject(error);
                        });
                    }

                    // Insertar nuevas asignaciones
                    const queryInsertAsignaciones = `
                        INSERT INTO tb_entrenador_gimnasio (id_entrenador, id_gimnasio) VALUES ?
                    `;

                    const values = id_gimnasios.map(id_gimnasio => [id_entrenador, id_gimnasio]);

                    connection.query(queryInsertAsignaciones, [values], (error, result) => {
                        if (error) {
                            return connection.rollback(() => {
                                connection.release();
                                reject(error);
                            });
                        }

                        connection.commit((commitError) => {
                            if (commitError) {
                                return connection.rollback(() => {
                                    connection.release();
                                    reject(commitError);
                                });
                            }

                            connection.release();
                            resolve({
                                mensaje: "Gimnasios asignados exitosamente"
                            });
                        });
                    });
                });
            });
        });
    });
};

module.exports = {
    obtenerEntrenadores,
    obtenerEntrenadorPorPersona,
    crearEntrenador,
    asignarGimnasios
};