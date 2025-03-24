const conexion = require('../config/conexion');

const listarAtletas = () => {
    return new Promise((resolve, reject) => {
        const queryPersonas = `SELECT * FROM tb_atleta a, tb_persona p where p.id_persona = a.id_persona`; 
        conexion.query(queryPersonas, (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); 
        });
    });
};

const listarAtletasPorIdPersona = ( id_persona ) => {
    return new Promise((resolve, reject) => {
        const queryAtletas = `SELECT * FROM tb_atleta a, tb_persona p WHERE a.id_persona = ? and p.id_persona = a.id_persona`; 
        conexion.query(queryAtletas, [id_persona], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); 
        });
    });
};

//pool 
const listarAtletasPorIdEntrenador = (idEntrenador) => {
    return new Promise((resolve, reject) => {
        // Obtener una conexión del pool
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            // Consulta SQL
            const queryAtletas = `
                SELECT * 
                FROM tb_atleta a
                JOIN tb_persona p ON a.id_persona = p.id_persona
                WHERE a.id_entrenador = ?
            `;

            // Ejecutar la consulta
            connection.query(queryAtletas, [idEntrenador], (error, resultados) => {
                // Liberar la conexión después de usarla
                connection.release();

                if (error) return reject(error);
                resolve(resultados);
            });
        });
    });
};

//pool
const crearAtleta = (atletaData) => {
    return new Promise((resolve, reject) => {
        // Obtener una conexión del pool
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            // Iniciar la transacción
            connection.beginTransaction((error) => {
                if (error) {
                    connection.release(); // Liberar la conexión en caso de error
                    return reject(error);
                }

                // Paso 1: Insertar en la tabla tb_persona
                const queryInsertPersona = `
                    INSERT INTO tb_persona (
                        dni, id_acceso, nombre, apellido, apodo, fecha_nacimiento,
                        celular, direccion, email, password, foto_archivo
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                const personaValues = [
                    atletaData.dni,
                    3, // Permiso de atleta
                    atletaData.nombre,
                    atletaData.apellido,
                    atletaData.apodo || null, // Si no se proporciona apodo, se inserta NULL
                    atletaData.fecha_nacimiento,
                    atletaData.celular || null, // Si no se proporciona celular, se inserta NULL
                    atletaData.direccion || null, // Si no se proporciona dirección, se inserta NULL
                    atletaData.email,
                    '$2b$10$5t2sv9aI6C9cbDtFlWp1iekWGMk.Addu7ha6dWzK50CC2Uc.1/Rzi', // Por defecto 123
                    null // Si no se proporciona foto_archivo, se inserta NULL por defecto en la imagen
                ];

                connection.query(queryInsertPersona, personaValues, (error, result) => {
                    if (error) {
                        // Si hay un error, revertir la transacción
                        return connection.rollback(() => {
                            connection.release(); // Liberar la conexión
                            reject(error);
                        });
                    }

                    // Obtener el ID de la persona recién creada
                    const idPersona = result.insertId;

                    // Paso 2: Insertar en la tabla tb_atleta
                    const queryInsertAtleta = `
                        INSERT INTO tb_atleta (
                            id_persona, id_entrenador, id_gimnasio, estado
                        ) VALUES (?, ?, ?, ?)
                    `;

                    const atletaValues = [
                        idPersona,
                        atletaData.id_entrenador,
                        atletaData.id_gimnasio,
                        'activo' // Por defecto, el estado será 'activo'
                    ];

                    connection.query(queryInsertAtleta, atletaValues, (error, resultAtleta) => {
                        if (error) {
                            // Si hay un error, revertir la transacción
                            return connection.rollback(() => {
                                connection.release(); // Liberar la conexión
                                reject(error);
                            });
                        }

                        // Confirmar la transacción
                        connection.commit((commitError) => {
                            if (commitError) {
                                // Si hay un error al confirmar, revertir la transacción
                                return connection.rollback(() => {
                                    connection.release(); // Liberar la conexión
                                    reject(commitError);
                                });
                            }

                            // Liberar la conexión después de confirmar
                            connection.release();

                            // Retornar el resultado final
                            resolve({
                                mensaje: "Atleta creado exitosamente",
                                id_persona: idPersona,
                                id_atleta: resultAtleta.insertId
                            });
                        });
                    });
                });
            });
        });
    });
};

const editarAtleta = (idAtleta, atletaData) => {
    return new Promise((resolve, reject) => {
        // Iniciar la transacción
        conexion.beginTransaction((error) => {
            if (error) return reject(error);

            // Paso 1: Obtener el id_persona asociado al id_atleta
            const queryGetPersonaId = `
                SELECT id_persona FROM tb_atleta WHERE id_atleta = ?
            `;

            conexion.query(queryGetPersonaId, [idAtleta], (error, result) => {
                if (error) {
                    // Si hay un error, revertir la transacción
                    return conexion.rollback(() => reject(error));
                }

                if (result.length === 0) {
                    // Si no se encuentra el atleta, rechazar la promesa
                    return conexion.rollback(() => reject(new Error("Atleta no encontrado")));
                }

                const idPersona = result[0].id_persona;

                // Paso 2: Actualizar en la tabla tb_persona
                const queryUpdatePersona = `
                    UPDATE tb_persona 
                    SET 
                        dni = ?, 
                        nombre = ?, 
                        apellido = ?, 
                        apodo = ?, 
                        fecha_nacimiento = ?, 
                        celular = ?, 
                        direccion = ?, 
                        email = ?, 
                        foto_archivo = ?
                    WHERE id_persona = ?
                `;

                const personaValues = [
                    atletaData.dni,
                    atletaData.nombre,
                    atletaData.apellido,
                    atletaData.apodo || null, // Si no se proporciona apodo, se inserta NULL
                    atletaData.fecha_nacimiento,
                    atletaData.celular || null, // Si no se proporciona celular, se inserta NULL
                    atletaData.direccion || null, // Si no se proporciona dirección, se inserta NULL
                    atletaData.email,
                    atletaData.foto_archivo || null, // Si no se proporciona foto_archivo, se inserta NULL
                    idPersona
                ];

                conexion.query(queryUpdatePersona, personaValues, (error) => {
                    if (error) {
                        // Si hay un error, revertir la transacción
                        return conexion.rollback(() => reject(error));
                    }

                    // Paso 3: Actualizar en la tabla tb_atleta
                    const queryUpdateAtleta = `
                        UPDATE tb_atleta 
                        SET 
                            id_entrenador = ?, 
                            id_gimnasio = ?, 
                            estado = ?
                        WHERE id_atleta = ?
                    `;

                    const atletaValues = [
                        atletaData.id_entrenador,
                        atletaData.id_gimnasio,
                        atletaData.estado || 'activo', // Por defecto, el estado será 'activo'
                        idAtleta
                    ];

                    conexion.query(queryUpdateAtleta, atletaValues, (error) => {
                        if (error) {
                            // Si hay un error, revertir la transacción
                            return conexion.rollback(() => reject(error));
                        }

                        // Confirmar la transacción
                        conexion.commit((commitError) => {
                            if (commitError) {
                                // Si hay un error al confirmar, revertir la transacción
                                return conexion.rollback(() => reject(commitError));
                            }

                            // Retornar el resultado final
                            resolve({
                                mensaje: "Atleta editado exitosamente",
                                id_persona: idPersona,
                                id_atleta: idAtleta
                            });
                        });
                    });
                });
            });
        });
    });
};


module.exports = {
    listarAtletas,
    listarAtletasPorIdEntrenador,
    crearAtleta,
    editarAtleta,
    listarAtletasPorIdPersona

};