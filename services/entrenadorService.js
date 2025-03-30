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
                JOIN tb_persona ON tb_persona.dni = tb_entrenador.dni
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
                    entrenadorData.dni,
                    2, // Permiso de entrenador (ajusta según tu lógica de roles)
                    entrenadorData.nombre,
                    entrenadorData.apellido,
                    entrenadorData.apodo || null, // Si no se proporciona apodo, se inserta NULL
                    entrenadorData.fecha_nacimiento,
                    entrenadorData.celular || null, // Si no se proporciona celular, se inserta NULL
                    entrenadorData.direccion || null, // Si no se proporciona dirección, se inserta NULL
                    entrenadorData.email,
                    '$2b$10$5t2sv9aI6C9cbDtFlWp1iekWGMk.Addu7ha6dWzK50CC2Uc.1/Rzi', // Contraseña por defecto (hash de "123")
                    null // Si no se proporciona foto_archivo, se inserta NULL por defecto
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

                    // Paso 2: Insertar en la tabla tb_entrenador
                    const queryInsertEntrenador = `
                        INSERT INTO tb_entrenador (
                            id_persona, fecha_ingreso, estado
                        ) VALUES (?, ?, ?)
                    `;

                    const entrenadorValues = [
                        idPersona,
                        entrenadorData.fecha_ingreso || new Date().toISOString().split('T')[0], // Fecha actual si no se proporciona
                        'activo' // Por defecto, el estado será 'activo'
                    ];

                    connection.query(queryInsertEntrenador, entrenadorValues, (error, resultEntrenador) => {
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
                                mensaje: "Entrenador creado exitosamente",
                                id_persona: idPersona,
                                id_entrenador: resultEntrenador.insertId
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
};