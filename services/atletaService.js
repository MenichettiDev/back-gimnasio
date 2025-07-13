const conexion = require('../config/conexion');
//pool aplicado
// 1. Listar todos los atletas
const listarAtletas = () => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryPersonas = `
                SELECT * 
                FROM tb_atleta a
                JOIN tb_persona p ON p.id_persona = a.id_persona
            `;

            connection.query(queryPersonas, (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados);
            });
        });
    });
};

// 2. Listar atletas por ID de persona
const listarAtletasPorIdPersona = (id_persona) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryAtletas = `
                SELECT * 
                FROM tb_atleta a
                JOIN tb_persona p ON p.id_persona = a.id_persona
                WHERE a.id_persona = ?
            `;

            connection.query(queryAtletas, [id_persona], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados);
            });
        });
    });
};

// 3. Editar un atleta
const editarAtleta = (idAtleta, atletaData) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            // Iniciar la transacción
            connection.beginTransaction((error) => {
                if (error) {
                    connection.release(); // Liberar la conexión
                    return reject(error);
                }

                // Paso 1: Obtener el id_persona asociado al id_atleta
                const queryGetPersonaId = `
                    SELECT id_persona 
                    FROM tb_atleta 
                    WHERE id_atleta = ?
                `;

                connection.query(queryGetPersonaId, [idAtleta], (error, result) => {
                    if (error) {
                        return connection.rollback(() => {
                            connection.release(); // Liberar la conexión
                            reject(error);
                        });
                    }

                    if (result.length === 0) {
                        return connection.rollback(() => {
                            connection.release(); // Liberar la conexión
                            reject(new Error("Atleta no encontrado"));
                        });
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

                    connection.query(queryUpdatePersona, personaValues, (error) => {
                        if (error) {
                            return connection.rollback(() => {
                                connection.release(); // Liberar la conexión
                                reject(error);
                            });
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

                        connection.query(queryUpdateAtleta, atletaValues, (error) => {
                            if (error) {
                                return connection.rollback(() => {
                                    connection.release(); // Liberar la conexión
                                    reject(error);
                                });
                            }

                            // Confirmar la transacción
                            connection.commit((commitError) => {
                                if (commitError) {
                                    return connection.rollback(() => {
                                        connection.release(); // Liberar la conexión
                                        reject(commitError);
                                    });
                                }

                                connection.release(); // Liberar la conexión
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
    });
};


// 4. Listar atletas por ID de entrenador
const listarAtletasPorIdEntrenador = (id_entrenador) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryAtletas = `
                SELECT * 
                FROM tb_atleta a
                JOIN tb_persona p ON p.id_persona = a.id_persona
                WHERE a.id_entrenador = ? or a.id_atleta = 0
            `;

            connection.query(queryAtletas, [id_entrenador], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados);
            });
        });
    });
};

// 4. Listar atletas por ID de entrenador
const listarAtletasPorIdGimnasio = (id_gimnasio) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryAtletas = `
                SELECT * 
                FROM tb_atleta a
                JOIN tb_persona p ON p.id_persona = a.id_persona
                WHERE a.id_gimnasio = ? or a.id_atleta = 0
            `;

            connection.query(queryAtletas, [id_gimnasio], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados);
            });
        });
    });
};

// 5. Crear un nuevo atleta
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
                        atletaData.id_entrenador || null, // Si no se proporciona id_entrenador, se inserta NULL
                        atletaData.id_gimnasio || null, // Si no se proporciona id_gimnasio, se inserta NULL
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



module.exports = {
    listarAtletas,
    listarAtletasPorIdEntrenador,
    crearAtleta,
    editarAtleta,
    listarAtletasPorIdPersona,
    listarAtletasPorIdGimnasio

};