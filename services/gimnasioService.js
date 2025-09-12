const conexion = require('../config/conexion');
const bcrypt = require('bcrypt');
//Pool aplicado
// 1. Listar todos los gimnasios

const listarGimnasios = () => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryGimnasios = 'SELECT * FROM tb_gimnasio';
            connection.query(queryGimnasios, (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve todos los gimnasios
            });
        });
    });
};

// 2. Listar gimnasio por ID de entrenador
const listarGimnasioPorIdEntrenador = (idEntrenador) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryGimnasio = `
                SELECT g.* 
                FROM tb_gimnasio g
                JOIN tb_entrenador_gimnasio i ON g.id_gimnasio = i.id_gimnasio
                WHERE i.id_entrenador = ?
            `;

            connection.query(queryGimnasio, [idEntrenador], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve los gimnasios asociados al entrenador
            });
        });
    });
};

// 3. Listar gimnasio por ID de atleta
const listarGimnasioPorIdAtleta = (idAtleta) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryGimnasio = `
                SELECT g.* 
                FROM tb_gimnasio g
                JOIN tb_atleta a ON g.id_gimnasio = a.id_gimnasio
                WHERE a.id_atleta = ?
            `;

            connection.query(queryGimnasio, [idAtleta], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve los gimnasios asociados al atleta
            });
        });
    });
};


// 4. Crear un nuevo gimnasio
const crearGimnasio = (gimnasioData) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            // Hashear la contraseña antes de guardar
            bcrypt.hash(gimnasioData.password || '123', 10, (hashErr, hashedPassword) => {
                if (hashErr) {
                    connection.release();
                    return reject(hashErr);
                }

                connection.beginTransaction((error) => {
                    if (error) {
                        connection.release();
                        return reject(error);
                    }

                    // Paso 1: Insertar en tb_persona
                    const queryInsertPersona = `
                        INSERT INTO tb_persona (
                            dni, id_acceso, nombre, apellido, fecha_nacimiento,
                            celular, direccion, email, password, foto_archivo
                        ) VALUES (?, ?, ?, ?,?, ?, ?, ?, ?, ?)
                    `;
                    const personaValues = [
                        gimnasioData.dni,
                        4, // id_acceso para gimnasio (ajustar según tu tabla tb_acceso)
                        gimnasioData.nombre,
                        gimnasioData.apellido,
                        gimnasioData.fecha_nacimiento,
                        gimnasioData.celular || null,
                        gimnasioData.direccion || null,
                        gimnasioData.email,
                        hashedPassword, // Usar la contraseña hasheada
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

                        // Paso 2: Insertar en tb_gimnasio
                        const queryInsertGimnasio = `
                            INSERT INTO tb_gimnasio (
                                id_persona, nombre, direccion, telefono,
                                horario_apertura, horario_cierre, estado, descripcion,
                                ultimo_pago, pagina_web, foto
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `;
                        const gimnasioValues = [
                            idPersona,
                            gimnasioData.nombre_gimnasio,
                            gimnasioData.direccion_gimnasio,
                            gimnasioData.telefono || null,
                            gimnasioData.horario_apertura || null,
                            gimnasioData.horario_cierre || null,
                            'activo',
                            gimnasioData.descripcion || null,
                            gimnasioData.ultimo_pago || null,
                            gimnasioData.pagina_web || null,
                            null
                        ];

                        connection.query(queryInsertGimnasio, gimnasioValues, (error, resultGimnasio) => {
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
                                    mensaje: "Gimnasio creado exitosamente",
                                    id_persona: idPersona,
                                    id_gimnasio: resultGimnasio.insertId
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

module.exports = {
    listarGimnasioPorIdEntrenador,
    listarGimnasios,
    listarGimnasioPorIdAtleta,
    crearGimnasio
};