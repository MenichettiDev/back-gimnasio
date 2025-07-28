const conexion = require('../config/conexion');
// pool

// 1. Listar rutina por ID de rutina
const listarRutinaByIdRutina = (id_rutina) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

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
            connection.query(queryRutina, [id_rutina], (error, resultadosRutina) => {
                if (error) {
                    connection.release(); // Liberar la conexión
                    return reject('Error al consultar los datos de la rutina');
                }

                // Si no se encuentra la rutina, rechazar la promesa
                if (resultadosRutina.length === 0) {
                    connection.release(); // Liberar la conexión
                    return reject('No se encontró ninguna rutina con el ID proporcionado');
                }

                const rutina = resultadosRutina[0]; // Datos generales de la rutina

                // Ejecutar la segunda consulta para obtener los ejercicios
                connection.query(queryEjercicios, [id_rutina], (error, resultadosEjercicios) => {
                    connection.release(); // Liberar la conexión
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

                    const rutinaCompleta = {
                        rutina: {
                            id_rutina: rutina.id_rutina,
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

                    resolve(rutinaCompleta); // Devolver la rutina completa
                });
            });
        });
    });
};

// 2. Listar rutinas por ID de atleta
const listarRutinasByIdAtleta = (id_atleta, id_entrenador, id_gimnasio) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            // Consulta para obtener las rutinas asignadas al atleta y rutinas de atletas con el mismo entrenador o gimnasio
            const queryRutinas = `
                 SELECT DISTINCT
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
                LEFT JOIN tb_atleta a ON ra.id_atleta = a.id_atleta 
                WHERE ra.id_atleta = ? or ra.id_atleta = 0
                   OR (a.id_entrenador = ? AND ? IS NOT NULL)
                   OR (a.id_gimnasio = ? AND ? IS NOT NULL)
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
            connection.query(queryRutinas, [id_atleta, id_entrenador, id_entrenador, id_gimnasio, id_gimnasio], (error, resultadosRutinas) => {
                if (error) {
                    connection.release(); // Liberar la conexión
                    return reject('Error al consultar las rutinas del atleta');
                }

                // Si no se encuentran rutinas, devolver un array vacío
                if (resultadosRutinas.length === 0) {
                    connection.release(); // Liberar la conexión
                    return resolve([]);
                }

                // Array para almacenar las rutinas completas
                const rutinasCompletas = [];

                // Función para procesar cada rutina
                const procesarRutina = (index) => {
                    if (index >= resultadosRutinas.length) {
                        connection.release(); // Liberar la conexión
                        return resolve(rutinasCompletas); // Devolver todas las rutinas procesadas
                    }

                    const rutina = resultadosRutinas[index]; // Datos generales de la rutina

                    // Ejecutar la segunda consulta para obtener los ejercicios de la rutina
                    connection.query(queryEjercicios, [rutina.id_rutina], (error, resultadosEjercicios) => {
                        if (error) {
                            connection.release(); // Liberar la conexión
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
                                id_rutina: rutina.id_rutina,
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
    });
};

// 3. Buscar rutinas por filtros
const buscarRutinasByFiltro = (filtros) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const {
                nombre = '',
                fechaDesde = null,
                fechaHasta = null,
                objetivo = '',
                nivelAtleta = '',
                cantidadDias = '',
                idCreador = null,
            } = filtros;

            let queryRutinas = `
                SELECT 
                    r.id_rutina,
                    r.id_creador,
                    r.nombre,
                    r.cantidad_dias,
                    r.nivel_atleta,
                    r.objetivo,
                    r.descripcion
                FROM tb_rutina r
                WHERE 1=1
            `;
            const params = [];

            if (nombre) {
                queryRutinas += ` AND r.nombre LIKE ?`;
                params.push(`%${nombre}%`);
            }
            if (fechaDesde && fechaHasta) {
                queryRutinas += ` AND r.fecha_creacion BETWEEN ? AND ?`;
                params.push(fechaDesde, fechaHasta);
            } else if (fechaDesde) {
                queryRutinas += ` AND r.fecha_creacion >= ?`;
                params.push(fechaDesde);
            } else if (fechaHasta) {
                queryRutinas += ` AND r.fecha_creacion <= ?`;
                params.push(fechaHasta);
            }
            if (objetivo) {
                queryRutinas += ` AND r.objetivo = ?`;
                params.push(objetivo);
            }
            if (nivelAtleta) {
                queryRutinas += ` AND r.nivel_atleta = ?`;
                params.push(nivelAtleta);
            }
            if (cantidadDias) {
                queryRutinas += ` AND r.cantidad_dias = ?`;
                params.push(cantidadDias);
            }
            if (idCreador) {
                queryRutinas += ` AND r.id_creador = ?`;
                params.push(idCreador);
            }

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

            connection.query(queryRutinas, params, (error, resultadosRutinas) => {
                if (error) {
                    connection.release(); // Liberar la conexión
                    return reject('Error al consultar las rutinas');
                }

                if (resultadosRutinas.length === 0) {
                    connection.release(); // Liberar la conexión
                    return resolve([]); // Devolver un array vacío si no hay resultados
                }

                const rutinasCompletas = [];
                const procesarRutina = (index) => {
                    if (index >= resultadosRutinas.length) {
                        connection.release(); // Liberar la conexión
                        return resolve(rutinasCompletas);
                    }

                    const rutina = resultadosRutinas[index];
                    connection.query(queryEjercicios, [rutina.id_rutina], (error, resultadosEjercicios) => {
                        if (error) {
                            connection.release(); // Liberar la conexión
                            return reject('Error al consultar los ejercicios de la rutina');
                        }

                        const ejerciciosPorDia = resultadosEjercicios.reduce((acc, ejercicio) => {
                            if (!acc[ejercicio.dia]) acc[ejercicio.dia] = [];
                            acc[ejercicio.dia].push({
                                id_grupo_muscular: ejercicio.id_grupo_muscular,
                                id_ejercicio: ejercicio.id_ejercicio,
                                id_repeticion: ejercicio.id_repeticion,
                            });
                            return acc;
                        }, {});

                        const dias = Object.keys(ejerciciosPorDia).map(dia => ({
                            dia: parseInt(dia),
                            ejercicios: ejerciciosPorDia[dia],
                        }));

                        const rutinaCompleta = {
                            rutina: {
                                id_rutina: rutina.id_rutina,
                                id_creador: rutina.id_creador,
                                nombre: rutina.nombre,
                                cantidad_dias: rutina.cantidad_dias,
                                nivel_atleta: rutina.nivel_atleta,
                                objetivo: rutina.objetivo,
                                descripcion: rutina.descripcion,
                            },
                            ejercicios: dias,
                        };

                        rutinasCompletas.push(rutinaCompleta);
                        procesarRutina(index + 1);
                    });
                };

                procesarRutina(0);
            });
        });
    });
};

// 4. Crear una rutina y asignarla a un atleta  
const crearRutinaYAsignarAtleta = (rutina, ejercicios) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            connection.beginTransaction((err) => {
                if (err) {
                    connection.release(); // Liberar la conexión
                    return reject('Error al iniciar la transacción');
                }

                const queryRutina = `
                    INSERT INTO tb_rutina (id_creador, nombre, cantidad_dias, nivel_atleta, objetivo, descripcion)
                    VALUES (?, ?, ?, ?, ?, ?);
                `;
                connection.query(queryRutina, [rutina.id_creador, rutina.nombre, rutina.cantidad_dias, rutina.nivel_atleta, rutina.objetivo, rutina.descripcion], (error, results) => {
                    if (error) {
                        return connection.rollback(() => {
                            connection.release(); // Liberar la conexión
                            reject('Error al crear la rutina');
                        });
                    }

                    const id_rutina = results.insertId;

                    const queryRutinaAtleta = `
                        INSERT INTO tb_rutina_atleta (id_rutina, id_atleta, fecha_asignacion)
                        VALUES (?, ?, ?);
                    `;
                    connection.query(queryRutinaAtleta, [id_rutina, rutina.id_atleta, rutina.fecha_asignacion], (error) => {
                        if (error) {
                            return connection.rollback(() => {
                                connection.release(); // Liberar la conexión
                                reject('Error al asignar rutina al atleta');
                            });
                        }

                        const procesarEjercicios = ejercicios.flatMap(dia => {
                            return dia.ejercicios.map(ejercicio => {
                                return new Promise((resolve, reject) => {
                                    const queryEjercicio = `
                                        INSERT INTO tb_rutina_ejercicios (id_rutina, id_grupo_muscular, id_ejercicios, id_repeticion, dia)
                                        VALUES (?, ?, ?, ?, ?);
                                    `;
                                    connection.query(queryEjercicio, [id_rutina, ejercicio.id_grupo_muscular, ejercicio.id_ejercicio, ejercicio.id_repeticion, dia.dia], (error) => {
                                        if (error) {
                                            connection.release(); // Liberar la conexión
                                            return reject(`Error al asignar ejercicio del día ${dia.dia}: ${error.message}`);
                                        }
                                        resolve();
                                    });
                                });
                            });
                        });

                        Promise.all(procesarEjercicios)
                            .then(() => {
                                connection.commit((err) => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            connection.release(); // Liberar la conexión
                                            reject('Error al hacer commit de la transacción');
                                        });
                                    }
                                    connection.release(); // Liberar la conexión
                                    resolve('Rutina creada y asignada exitosamente');
                                });
                            })
                            .catch(err => {
                                connection.rollback(() => {
                                    connection.release(); // Liberar la conexión
                                    reject(err);
                                });
                            });
                    });
                });
            });
        });
    });
};

// 5. Editar una rutina y asignar un atleta
const editarRutinaYAsignarAtleta = (id_rutina, rutina, ejercicios, fecha_asignacion) => {
    return new Promise((resolve, reject) => {
        // Obtener una conexión del pool
        conexion.getConnection((err, connection) => {
            if (err) return reject('Error al obtener una conexión del pool: ' + err.message);

            // Comienza la transacción
            connection.beginTransaction((err) => {
                if (err) {
                    connection.release(); // Liberar la conexión
                    return reject('Error al iniciar la transacción: ' + err.message);
                }

                // 1. Actualizar la rutina existente
                const queryActualizarRutina = `
                    UPDATE tb_rutina
                    SET id_creador = ?, nombre = ?, cantidad_dias = ?, nivel_atleta = ?, objetivo = ?, descripcion = ?
                    WHERE id_rutina = ?;
                `;
                connection.query(queryActualizarRutina, [rutina.id_creador, rutina.nombre, rutina.cantidad_dias, rutina.nivel_atleta, rutina.objetivo, rutina.descripcion, id_rutina], (error) => {
                    if (error) {
                        return connection.rollback(() => {
                            connection.release(); // Liberar la conexión
                            reject('Error al actualizar la rutina: ' + error.message);
                        });
                    }

                    // 2. Actualizar la asignación del atleta a la rutina
                    const queryActualizarRutinaAtleta = `
                        UPDATE tb_rutina_atleta
                        SET id_atleta = ?, fecha_asignacion = ?
                        WHERE id_rutina = ?;
                    `;
                    connection.query(queryActualizarRutinaAtleta, [rutina.id_atleta, fecha_asignacion, id_rutina], (error) => {
                        if (error) {
                            return connection.rollback(() => {
                                connection.release(); // Liberar la conexión
                                reject('Error al actualizar la asignación de la rutina al atleta: ' + error.message);
                            });
                        }

                        // 3. Obtener los ejercicios actuales para esta rutina
                        const queryEjerciciosActuales = `
                            SELECT id_ejercicios, id_repeticion, dia FROM tb_rutina_ejercicios WHERE id_rutina = ?;
                        `;
                        connection.query(queryEjerciciosActuales, [id_rutina], (error, ejerciciosActuales) => {
                            if (error) {
                                return connection.rollback(() => {
                                    connection.release(); // Liberar la conexión
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
                                    connection.query(queryEliminarEjercicio, [id_rutina, ejercicio.id_ejercicio], (error) => {
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
                                    connection.query(queryAgregarEjercicio, [id_rutina, ejercicio.id_ejercicio, ejercicio.id_repeticion, ejercicio.dia], (error) => {
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
                                    connection.query(queryActualizarEjercicio, [ejercicio.id_repeticion, ejercicio.dia, id_rutina, ejercicio.id_ejercicio], (error) => {
                                        if (error) return reject('Error al actualizar ejercicio: ' + error.message);
                                        resolve();
                                    });
                                });
                            });

                            // Ejecutar todas las operaciones
                            Promise.all([...eliminarQueries, ...agregarQueries, ...actualizarQueries])
                                .then(() => {
                                    // Commit la transacción
                                    connection.commit((err) => {
                                        if (err) {
                                            return connection.rollback(() => {
                                                connection.release(); // Liberar la conexión
                                                reject('Error al hacer commit de la transacción: ' + err.message);
                                            });
                                        }
                                        connection.release(); // Liberar la conexión
                                        resolve('Rutina editada y asignada exitosamente');
                                    });
                                })
                                .catch(err => {
                                    connection.rollback(() => {
                                        connection.release(); // Liberar la conexión
                                        reject(err);
                                    });
                                });
                        });
                    });
                });
            });
        });
    });
};

// 6. Eliminar una rutina y todas sus relaciones
const eliminarRutinaConRelaciones = (id_rutina) => {
    return new Promise((resolve, reject) => {
        // Obtener una conexión del pool
        conexion.getConnection((err, connection) => {
            if (err) return reject('Error al obtener una conexión del pool: ' + err.message);

            // Comienza la transacción
            connection.beginTransaction((err) => {
                if (err) {
                    connection.release(); // Liberar la conexión
                    return reject('Error al iniciar la transacción: ' + err.message);
                }

                // 1. Eliminar las relaciones de la rutina en tb_rutina_ejercicios
                const queryEliminarEjercicios = `
                    DELETE FROM tb_rutina_ejercicios WHERE id_rutina = ?;
                `;
                connection.query(queryEliminarEjercicios, [id_rutina], (error) => {
                    if (error) {
                        return connection.rollback(() => {
                            connection.release(); // Liberar la conexión
                            reject('Error al eliminar ejercicios asociados a la rutina: ' + error.message);
                        });
                    }

                    // 2. Eliminar la relación de la rutina con el atleta en tb_rutina_atleta
                    const queryEliminarRutinaAtleta = `
                        DELETE FROM tb_rutina_atleta WHERE id_rutina = ?;
                    `;
                    connection.query(queryEliminarRutinaAtleta, [id_rutina], (error) => {
                        if (error) {
                            return connection.rollback(() => {
                                connection.release(); // Liberar la conexión
                                reject('Error al eliminar la relación de la rutina con el atleta: ' + error.message);
                            });
                        }

                        // 3. Eliminar la rutina de tb_rutina
                        const queryEliminarRutina = `
                            DELETE FROM tb_rutina WHERE id_rutina = ?;
                        `;
                        connection.query(queryEliminarRutina, [id_rutina], (error) => {
                            if (error) {
                                return connection.rollback(() => {
                                    connection.release(); // Liberar la conexión
                                    reject('Error al eliminar la rutina: ' + error.message);
                                });
                            }

                            // Commit si todo fue exitoso
                            connection.commit((err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release(); // Liberar la conexión
                                        reject('Error al realizar commit de la transacción: ' + err.message);
                                    });
                                }
                                connection.release(); // Liberar la conexión
                                resolve('Rutina y todas sus relaciones eliminadas exitosamente');
                            });
                        });
                    });
                });
            });
        });
    });
};

// 7. Listar rutinas por ID de creador
const listarRutinaByIdCreador = (id_creador) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            // Consulta para obtener las rutinas creadas por el id_creador
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
                WHERE r.id_creador = ?
                ORDER BY r.id_rutina DESC;
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

            connection.query(queryRutinas, [id_creador], (error, resultadosRutinas) => {
                if (error) {
                    connection.release();
                    return reject('Error al consultar las rutinas del creador');
                }

                if (resultadosRutinas.length === 0) {
                    connection.release();
                    return resolve([]);
                }

                const rutinasCompletas = [];
                const procesarRutina = (index) => {
                    if (index >= resultadosRutinas.length) {
                        connection.release();
                        return resolve(rutinasCompletas);
                    }

                    const rutina = resultadosRutinas[index];

                    connection.query(queryEjercicios, [rutina.id_rutina], (error, resultadosEjercicios) => {
                        if (error) {
                            connection.release();
                            return reject('Error al consultar los ejercicios de la rutina');
                        }

                        const ejerciciosPorDia = resultadosEjercicios.reduce((acc, ejercicio) => {
                            if (!acc[ejercicio.dia]) acc[ejercicio.dia] = [];
                            acc[ejercicio.dia].push({
                                id_grupo_muscular: ejercicio.id_grupo_muscular,
                                id_ejercicio: ejercicio.id_ejercicio,
                                id_repeticion: ejercicio.id_repeticion,
                            });
                            return acc;
                        }, {});

                        const dias = Object.keys(ejerciciosPorDia).map(dia => ({
                            dia: parseInt(dia),
                            ejercicios: ejerciciosPorDia[dia],
                        }));

                        const rutinaCompleta = {
                            rutina: {
                                id_rutina: rutina.id_rutina,
                                id_creador: rutina.id_creador,
                                nombre: rutina.nombre,
                                cantidad_dias: rutina.cantidad_dias,
                                nivel_atleta: rutina.nivel_atleta,
                                objetivo: rutina.objetivo,
                                descripcion: rutina.descripcion,
                                id_atleta: rutina.id_atleta,
                                fecha_asignacion: rutina.fecha_asignacion,
                            },
                            ejercicios: dias,
                        };

                        rutinasCompletas.push(rutinaCompleta);
                        procesarRutina(index + 1);
                    });
                };

                procesarRutina(0);
            });
        });
    });
};

module.exports = {
    listarRutinasByIdAtleta,
    crearRutinaYAsignarAtleta,
    editarRutinaYAsignarAtleta,
    eliminarRutinaConRelaciones,
    listarRutinaByIdRutina,
    buscarRutinasByFiltro,
    listarRutinaByIdCreador
};