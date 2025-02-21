
const conexion = require('../config/conexion');

// 1. Listar todas las personas
const listarPersonas = () => {
    return new Promise((resolve, reject) => {
        const queryPersonas = `SELECT * FROM tb_persona`;
        conexion.query(queryPersonas, (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados);
        });
    });
};

// 2. Obtener una persona por su ID
const obtenerPersonaPorId = (idPersona) => {
    return new Promise((resolve, reject) => {
        const queryPersona = `SELECT * FROM tb_persona WHERE id_persona = ?`;
        conexion.query(queryPersona, [idPersona], (error, resultados) => {
            if (error) return reject(error);
            if (resultados.length === 0) {
                return reject(new Error("Persona no encontrada"));
            }
            resolve(resultados[0]);
        });
    });
};

// 3. Crear una nueva persona
const crearPersona = (personaData) => {
    return new Promise((resolve, reject) => {
        // Iniciar la transacción
        conexion.beginTransaction((error) => {
            if (error) return reject(error);

            // Paso 1: Insertar en la tabla tb_persona
            const queryInsertPersona = `
                INSERT INTO tb_persona (
                    dni, id_acceso, nombre, apellido, apodo, fecha_nacimiento,
                    celular, direccion, email, password, foto_archivo
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const personaValues = [
                personaData.dni,
                personaData.id_acceso || 3, // Permiso por defecto (puedes ajustarlo)
                personaData.nombre,
                personaData.apellido,
                personaData.apodo || null, // Si no se proporciona apodo, se inserta NULL
                personaData.fecha_nacimiento,
                personaData.celular || null, // Si no se proporciona celular, se inserta NULL
                personaData.direccion || null, // Si no se proporciona dirección, se inserta NULL
                personaData.email,
                '$2b$10$5t2sv9aI6C9cbDtFlWp1iekWGMk.Addu7ha6dWzK50CC2Uc.1/Rzi', // Contraseña por defecto (123)
                personaData.foto_archivo || null // Si no se proporciona foto_archivo, se inserta NULL
            ];

            conexion.query(queryInsertPersona, personaValues, (error, result) => {
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
                        mensaje: "Persona creada exitosamente",
                        id_persona: result.insertId
                    });
                });
            });
        });
    });
};

// 4. Editar una persona existente
const editarPersona = (idPersona, personaData) => {
    return new Promise((resolve, reject) => {
        // Iniciar la transacción
        conexion.beginTransaction((error) => {
            if (error) return reject(error);

            // Paso 1: Actualizar en la tabla tb_persona
            const queryUpdatePersona = `
                UPDATE tb_persona 
                SET 
                    dni = ?, 
                    id_acceso = ?, 
                    nombre = ?, 
                    apellido = ?, 
                    apodo = ?, 
                    fecha_nacimiento = ?, 
                    celular = ?, 
                    direccion = ?, 
                    email = ?, 
                    password = ?, 
                    foto_archivo = ?
                WHERE id_persona = ?
            `;
            const personaValues = [
                personaData.dni,
                personaData.id_acceso || 3, // Permiso por defecto (puedes ajustarlo)
                personaData.nombre,
                personaData.apellido,
                personaData.apodo || null, // Si no se proporciona apodo, se inserta NULL
                personaData.fecha_nacimiento,
                personaData.celular || null, // Si no se proporciona celular, se inserta NULL
                personaData.direccion || null, // Si no se proporciona dirección, se inserta NULL
                personaData.email,
                personaData.password || '$2b$10$5t2sv9aI6C9cbDtFlWp1iekWGMk.Addu7ha6dWzK50CC2Uc.1/Rzi', // Contraseña por defecto (123)
                personaData.foto_archivo || null, // Si no se proporciona foto_archivo, se inserta NULL
                idPersona
            ];

            conexion.query(queryUpdatePersona, personaValues, (error) => {
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
                        mensaje: "Persona editada exitosamente",
                        id_persona: idPersona
                    });
                });
            });
        });
    });
};

// 5. Eliminar una persona por su ID
const eliminarPersona = (idPersona) => {
    return new Promise((resolve, reject) => {
        const queryDeletePersona = `DELETE FROM tb_persona WHERE id_persona = ?`;
        conexion.query(queryDeletePersona, [idPersona], (error, result) => {
            if (error) return reject(error);
            if (result.affectedRows === 0) {
                return reject(new Error("Persona no encontrada"));
            }
            resolve({ mensaje: "Persona eliminada exitosamente" });
        });
    });
};

module.exports = {
    listarPersonas,
    obtenerPersonaPorId,
    crearPersona,
    editarPersona,
    eliminarPersona
};