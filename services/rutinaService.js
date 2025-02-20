const conexion = require('../config/conexion');

const listarRutinasFree = () => {
    return new Promise((resolve, reject) => {
        const queryRutina = `SELECT * FROM tb_rutina where id_rutina < 13`;
        conexion.query(queryRutina, (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados);
        });
    });
};

const listarRutinaByIdCreador = (id_persona) => {
    return new Promise((resolve, reject) => {
        const queryRutina = `SELECT * FROM tb_rutina where id_creador = ?`;
        conexion.query(queryRutina, [id_persona], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados);
        });
    });
};

const listarRutinaByIdRutina = (id_rutina) => {
    return new Promise((resolve, reject) => {
        // Consulta para obtener los datos generales de la rutina
        const queryRutina = `
            SELECT 
                r.id_rutina,
                r.id_creador,
                r.nombre,
                r.cantidad_dias,
                r.nivel_atleta,
                r.objetivo,
                r.descripcion,
                ra.id_atleta,
                ra.fecha_asignacion
            FROM tb_rutina r
            LEFT JOIN tb_rutina_atleta ra ON r.id_rutina = ra.id_rutina
            WHERE r.id_rutina = ?;
        `;

        // Consulta para obtener los ejercicios de la rutina por día
        const queryEjercicios = `
            SELECT 
                dia,
                id_grupo_muscular,
                id_ejercicios AS id_ejercicio,
                id_repeticion
            FROM tb_rutina_ejercicios
            WHERE id_rutina = ?
            ORDER BY dia ASC;
        `;

        // Ejecutar la primera consulta para obtener los datos generales de la rutina
        conexion.query(queryRutina, [id_rutina], (error, resultadosRutina) => {
            if (error) {
                return reject('Error al consultar los datos de la rutina');
            }

            // Si no se encuentra la rutina, rechazar la promesa
            if (resultadosRutina.length === 0) {
                return reject('No se encontró ninguna rutina con el ID proporcionado');
            }

            const rutina = resultadosRutina[0]; // Datos generales de la rutina

            // Ejecutar la segunda consulta para obtener los ejercicios
            conexion.query(queryEjercicios, [id_rutina], (error, resultadosEjercicios) => {
                if (error) {
                    return reject('Error al consultar los ejercicios de la rutina');
                }

                // Agrupar los ejercicios por día
                const ejerciciosPorDia = resultadosEjercicios.reduce((acc, ejercicio) => {
                    if (!acc[ejercicio.dia]) {
                        acc[ejercicio.dia] = [];
                    }
                    acc[ejercicio.dia].push({
                        id_grupo_muscular: ejercicio.id_grupo_muscular,
                        id_ejercicio: ejercicio.id_ejercicio,
                        id_repeticion: ejercicio.id_repeticion,
                    });
                    return acc;
                }, {});

                // Formatear los ejercicios en una estructura de días
                const dias = Object.keys(ejerciciosPorDia).map(dia => ({
                    dia: parseInt(dia),
                    ejercicios: ejerciciosPorDia[dia],
                }));

                // Construir el objeto final de la rutina
                const rutinaCompleta = {
                    id_rutina: rutina.id_rutina,
                    id_creador: rutina.id_creador,
                    nombre: rutina.nombre,
                    cantidad_dias: rutina.cantidad_dias,
                    nivel_atleta: rutina.nivel_atleta,
                    objetivo: rutina.objetivo,
                    descripcion: rutina.descripcion,
                    id_atleta: rutina.id_atleta,
                    fecha_asignacion: rutina.fecha_asignacion,
                    dias: dias,
                };

                resolve(rutinaCompleta); // Devolver la rutina completa
            });
        });
    });
};


const listarRutinasByIdAtleta = (id_atleta) => {
    return new Promise((resolve, reject) => {
        // Consulta para obtener las rutinas asignadas al atleta, ordenadas por fecha
        const queryRutinas = `
            SELECT 
                r.id_rutina,
                r.id_creador,
                r.nombre,
                r.cantidad_dias,
                r.nivel_atleta,
                r.objetivo,
                r.descripcion,
                ra.id_atleta,
                ra.fecha_asignacion
            FROM tb_rutina r
            LEFT JOIN tb_rutina_atleta ra ON r.id_rutina = ra.id_rutina
            WHERE ra.id_atleta = ?
            ORDER BY ra.fecha_asignacion DESC;
        `;

        // Consulta para obtener los ejercicios de una rutina por día
        const queryEjercicios = `
            SELECT 
                dia,
                id_grupo_muscular,
                id_ejercicios AS id_ejercicio,
                id_repeticion
            FROM tb_rutina_ejercicios
            WHERE id_rutina = ?
            ORDER BY dia ASC;
        `;

        // Ejecutar la primera consulta para obtener las rutinas del atleta
        conexion.query(queryRutinas, [id_atleta], (error, resultadosRutinas) => {
            if (error) {
                return reject('Error al consultar las rutinas del atleta');
            }

            // Si no se encuentran rutinas, rechazar la promesa
            if (resultadosRutinas.length === 0) {
                return reject('No se encontraron rutinas para el atleta con el ID proporcionado');
            }

            // Array para almacenar las rutinas completas
            const rutinasCompletas = [];

            // Función para procesar cada rutina
            const procesarRutina = (index) => {
                if (index >= resultadosRutinas.length) {
                    return resolve(rutinasCompletas); // Devolver todas las rutinas procesadas
                }

                const rutina = resultadosRutinas[index]; // Datos generales de la rutina

                // Ejecutar la segunda consulta para obtener los ejercicios de la rutina
                conexion.query(queryEjercicios, [rutina.id_rutina], (error, resultadosEjercicios) => {
                    if (error) {
                        return reject('Error al consultar los ejercicios de la rutina');
                    }

                    // Agrupar los ejercicios por día
                    const ejerciciosPorDia = resultadosEjercicios.reduce((acc, ejercicio) => {
                        if (!acc[ejercicio.dia]) {
                            acc[ejercicio.dia] = [];
                        }
                        acc[ejercicio.dia].push({
                            id_grupo_muscular: ejercicio.id_grupo_muscular,
                            id_ejercicio: ejercicio.id_ejercicio,
                            id_repeticion: ejercicio.id_repeticion,
                        });
                        return acc;
                    }, {});

                    // Formatear los ejercicios en una estructura de días
                    const dias = Object.keys(ejerciciosPorDia).map(dia => ({
                        dia: parseInt(dia),
                        ejercicios: ejerciciosPorDia[dia],
                    }));

                    // Construir el objeto final de la rutina en el formato requerido
                    const rutinaCompleta = {
                        rutina: {
                            id_creador: rutina.id_creador,
                            nombre: rutina.nombre,
                            cantidad_dias: rutina.cantidad_dias,
                            nivel_atleta: rutina.nivel_atleta,
                            objetivo: rutina.objetivo,
                            descripcion: rutina.descripcion,
                            id_atleta: rutina.id_atleta,
                            fecha_asignacion: rutina.fecha_asignacion,
                        },
                        ejercicios: dias, // Los ejercicios ya están agrupados por día
                    };

                    // Agregar la rutina completa al array
                    rutinasCompletas.push(rutinaCompleta);

                    // Procesar la siguiente rutina
                    procesarRutina(index + 1);
                });
            };

            // Iniciar el procesamiento de las rutinas
            procesarRutina(0);
        });
    });
};



const crearRutinaYAsignarAtleta = (rutina, ejercicios ) => {
    return new Promise((resolve, reject) => {
        // Comienza la transacción
        conexion.beginTransaction((err) => {
            if (err) {
                return reject('Error al iniciar la transacción');
            }

            // 1. Crear la rutina
            const queryRutina = `
                INSERT INTO tb_rutina (id_creador, nombre, cantidad_dias, nivel_atleta, objetivo, descripcion)
                VALUES (?, ?, ?, ?, ?, ?);
            `;
            conexion.query(queryRutina, [rutina.id_creador, rutina.nombre, rutina.cantidad_dias, rutina.nivel_atleta, rutina.objetivo, rutina.descripcion], (error, results) => {
                if (error) {
                    return conexion.rollback(() => {
                        reject('Error al crear la rutina');
                    });
                }

                const id_rutina = results.insertId; // id_rutina generado automáticamente

                // 2. Asignar la rutina al atleta
                const queryRutinaAtleta = `
                    INSERT INTO tb_rutina_atleta (id_rutina, id_atleta, fecha_asignacion)
                    VALUES (?, ?, ?);
                `;
                conexion.query(queryRutinaAtleta, [id_rutina, rutina.id_atleta, rutina.fecha_asignacion], (error) => {
                    if (error) {
                        return conexion.rollback(() => {
                            reject('Error al asignar rutina al atleta');
                        });
                    }

                    // 3. Procesar los ejercicios por día
                    const procesarEjercicios = ejercicios.flatMap(dia => {
                        return dia.ejercicios.map(ejercicio => {
                            return new Promise((resolve, reject) => {
                                const queryEjercicio = `
                                    INSERT INTO tb_rutina_ejercicios (id_rutina, id_grupo_muscular, id_ejercicios, id_repeticion, dia)
                                    VALUES (?, ?, ?, ?, ?);
                                `;
                                conexion.query(queryEjercicio, [id_rutina, ejercicio.id_grupo_muscular, ejercicio.id_ejercicio, ejercicio.id_repeticion, dia.dia], (error) => {
                                    if (error) {
                                        return reject(`Error al asignar ejercicio del día ${dia.dia}: ${error.message}`);
                                    }
                                    resolve();
                                });
                            });
                        });
                    });

                    // Esperar a que todos los ejercicios se procesen
                    Promise.all(procesarEjercicios)
                        .then(() => {
                            // Si todo fue exitoso, commit la transacción
                            conexion.commit((err) => {
                                if (err) {
                                    return conexion.rollback(() => {
                                        reject('Error al hacer commit de la transacción');
                                    });
                                }
                                resolve('Rutina creada y asignada exitosamente');
                            });
                        })
                        .catch(err => {
                            conexion.rollback(() => {
                                reject(err);
                            });
                        });
                });
            });
        });
    });
};

const editarRutinaYAsignarAtleta = (id_rutina, rutina, ejercicios, fecha_asignacion) => {
    return new Promise((resolve, reject) => {
        // Comienza la transacción
        conexion.beginTransaction((err) => {
            if (err) {
                return reject('Error al iniciar la transacción');
            }

            // 1. Actualizar la rutina existente
            const queryActualizarRutina = `
                UPDATE tb_rutina
                SET id_creador = ?, nombre = ?, cantidad_dias = ?, nivel_atleta = ?, objetivo = ?, descripcion = ?
                WHERE id_rutina = ?;
            `;
            conexion.query(queryActualizarRutina, [rutina.id_creador, rutina.nombre, rutina.cantidad_dias, rutina.nivel_atleta, rutina.objetivo, rutina.descripcion, id_rutina], (error) => {
                if (error) {
                    return conexion.rollback(() => {
                        reject('Error al actualizar la rutina: ' + error.message);
                    });
                }

                // 2. Actualizar la asignación del atleta a la rutina
                const queryActualizarRutinaAtleta = `
                    UPDATE tb_rutina_atleta
                    SET id_atleta = ?, fecha_asignacion = ?
                    WHERE id_rutina = ?;
                `;
                conexion.query(queryActualizarRutinaAtleta, [rutina.id_atleta, fecha_asignacion, id_rutina], (error) => {
                    if (error) {
                        return conexion.rollback(() => {
                            reject('Error al actualizar la asignación de la rutina al atleta: ' + error.message);
                        });
                    }

                    // 3. Obtener los ejercicios actuales para esta rutina
                    const queryEjerciciosActuales = `
                        SELECT id_ejercicios, id_repeticion, dia FROM tb_rutina_ejercicios WHERE id_rutina = ?;
                    `;
                    conexion.query(queryEjerciciosActuales, [id_rutina], (error, ejerciciosActuales) => {
                        if (error) {
                            return conexion.rollback(() => {
                                reject('Error al obtener ejercicios actuales: ' + error.message);
                            });
                        }

                        // Convertir los resultados en un mapa para facilitar la comparación
                        const ejerciciosActualesMap = new Map();
                        ejerciciosActuales.forEach(ejercicio => {
                            ejerciciosActualesMap.set(ejercicio.id_ejercicio, ejercicio);
                        });

                        // 4. Procesar los nuevos ejercicios
                        const nuevosEjercicios = ejercicios.flatMap(dia => 
                            dia.ejercicios.map(ejercicio => ({
                                id_ejercicio: ejercicio.id_ejercicio,
                                id_repeticion: ejercicio.id_repeticion,
                                dia: dia.dia
                            }))
                        );

                        // Identificar qué ejercicios mantener, eliminar o agregar
                        const ejerciciosAMantener = [];
                        const ejerciciosAEliminar = [];
                        const ejerciciosAAgregar = [];

                        nuevosEjercicios.forEach(nuevoEjercicio => {
                            if (ejerciciosActualesMap.has(nuevoEjercicio.id_ejercicio)) {
                                const ejercicioActual = ejerciciosActualesMap.get(nuevoEjercicio.id_ejercicio);
                                if (ejercicioActual.id_repeticion !== nuevoEjercicio.id_repeticion || ejercicioActual.dia !== nuevoEjercicio.dia) {
                                    // El ejercicio existe pero ha cambiado algún dato -> actualizar
                                    ejerciciosAMantener.push(nuevoEjercicio);
                                } else {
                                    // El ejercicio existe y no ha cambiado -> mantener
                                    ejerciciosAMantener.push(nuevoEjercicio);
                                }
                                ejerciciosActualesMap.delete(nuevoEjercicio.id_ejercicio); // Eliminar del mapa para identificar eliminaciones
                            } else {
                                // El ejercicio es nuevo -> agregar
                                ejerciciosAAgregar.push(nuevoEjercicio);
                            }
                        });

                        // Los ejercicios restantes en el mapa son los que deben eliminarse
                        ejerciciosAEliminar.push(...ejerciciosActualesMap.values());

                        // 5. Realizar las operaciones necesarias
                        const eliminarQueries = ejerciciosAEliminar.map(ejercicio => {
                            return new Promise((resolve, reject) => {
                                const queryEliminarEjercicio = `
                                    DELETE FROM tb_rutina_ejercicios
                                    WHERE id_rutina = ? AND id_ejercicio = ?;
                                `;
                                conexion.query(queryEliminarEjercicio, [id_rutina, ejercicio.id_ejercicio], (error) => {
                                    if (error) return reject('Error al eliminar ejercicio: ' + error.message);
                                    resolve();
                                });
                            });
                        });

                        const agregarQueries = ejerciciosAAgregar.map(ejercicio => {
                            return new Promise((resolve, reject) => {
                                const queryAgregarEjercicio = `
                                    INSERT INTO tb_rutina_ejercicios (id_rutina, id_ejercicios, id_repeticion, dia)
                                    VALUES (?, ?, ?, ?);
                                `;
                                conexion.query(queryAgregarEjercicio, [id_rutina, ejercicio.id_ejercicio, ejercicio.id_repeticion, ejercicio.dia], (error) => {
                                    if (error) return reject('Error al agregar ejercicio: ' + error.message);
                                    resolve();
                                });
                            });
                        });

                        const actualizarQueries = ejerciciosAMantener.map(ejercicio => {
                            return new Promise((resolve, reject) => {
                                const queryActualizarEjercicio = `
                                    UPDATE tb_rutina_ejercicios
                                    SET id_repeticion = ?, dia = ?
                                    WHERE id_rutina = ? AND id_ejercicios = ?;
                                `;
                                conexion.query(queryActualizarEjercicio, [ejercicio.id_repeticion, ejercicio.dia, id_rutina, ejercicio.id_ejercicio], (error) => {
                                    if (error) return reject('Error al actualizar ejercicio: ' + error.message);
                                    resolve();
                                });
                            });
                        });

                        // Ejecutar todas las operaciones
                        Promise.all([...eliminarQueries, ...agregarQueries, ...actualizarQueries])
                            .then(() => {
                                // Commit la transacción
                                conexion.commit((err) => {
                                    if (err) {
                                        return conexion.rollback(() => {
                                            reject('Error al hacer commit de la transacción: ' + err.message);
                                        });
                                    }
                                    resolve('Rutina editada y asignada exitosamente');
                                });
                            })
                            .catch(err => {
                                conexion.rollback(() => {
                                    reject(err);
                                });
                            });
                    });
                });
            });
        });
    });
};


const eliminarRutinaConRelaciones = (id_rutina) => {
    return new Promise((resolve, reject) => {
        // Comienza la transacción
        conexion.beginTransaction((err) => {
            if (err) {
                return reject('Error al iniciar la transacción: ' + err.message);
            }

            // 1. Eliminar las relaciones de la rutina en tb_rutina_ejercicios
            const queryEliminarEjercicios = `
                DELETE FROM tb_rutina_ejercicios WHERE id_rutina = ?;
            `;
            conexion.query(queryEliminarEjercicios, [id_rutina], (error) => {
                if (error) {
                    return conexion.rollback(() => {
                        reject('Error al eliminar ejercicios asociados a la rutina: ' + error.message);
                    });
                }

                // 2. Eliminar la relación de la rutina con el atleta en tb_rutina_atleta
                const queryEliminarRutinaAtleta = `
                    DELETE FROM tb_rutina_atleta WHERE id_rutina = ?;
                `;
                conexion.query(queryEliminarRutinaAtleta, [id_rutina], (error) => {
                    if (error) {
                        return conexion.rollback(() => {
                            reject('Error al eliminar la relación de la rutina con el atleta: ' + error.message);
                        });
                    }

                    // 3. Eliminar la rutina de tb_rutina
                    const queryEliminarRutina = `
                        DELETE FROM tb_rutina WHERE id_rutina = ?;
                    `;
                    conexion.query(queryEliminarRutina, [id_rutina], (error) => {
                        if (error) {
                            return conexion.rollback(() => {
                                reject('Error al eliminar la rutina: ' + error.message);
                            });
                        }

                        // Commit si todo fue exitoso
                        conexion.commit((err) => {
                            if (err) {
                                return conexion.rollback(() => {
                                    reject('Error al realizar commit de la transacción: ' + err.message);
                                });
                            }
                            resolve('Rutina y todas sus relaciones eliminadas exitosamente');
                        });
                    });
                });
            });
        });
    });
};



module.exports = {
    listarRutinasFree,
    listarRutinaByIdCreador,
    listarRutinasByIdAtleta,
    crearRutinaYAsignarAtleta,
    editarRutinaYAsignarAtleta,
    eliminarRutinaConRelaciones,
    listarRutinaByIdRutina

};