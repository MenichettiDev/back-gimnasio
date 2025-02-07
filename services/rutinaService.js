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

const listarRutinaByIdAtleta = (id_atleta) => {
    return new Promise((resolve, reject) => {
        const queryRutina = `SELECT * FROM tb_rutina r, tb_rutina_atleta i 
        where i.id_atleta = ? and r.id_rutina = i.id_rutina`;
        conexion.query(queryRutina, [id_atleta], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados);
        });
    });
};

const crearRutinaYAsignarAtleta = (rutina, ejercicios, fecha_asignacion) => {
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
                conexion.query(queryRutinaAtleta, [id_rutina, rutina.id_atleta, fecha_asignacion], (error) => {
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




const editarRutinaYAsignarAtleta = (id_rutina, rutina, id_atleta, id_grupo_muscular, id_ejercicio, fecha_asignacion) => {
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
                conexion.query(queryActualizarRutinaAtleta, [id_atleta, fecha_asignacion, id_rutina], (error) => {
                    if (error) {
                        return conexion.rollback(() => {
                            reject('Error al actualizar la asignación de la rutina al atleta: ' + error.message);
                        });
                    }

                    // 3. Eliminar los grupos musculares actuales para esta rutina
                    const queryEliminarGruposMusculares = `
                        DELETE FROM tb_rutina_grupo_muscular WHERE id_rutina = ?;
                    `;
                    conexion.query(queryEliminarGruposMusculares, [id_rutina], (error) => {
                        if (error) {
                            return conexion.rollback(() => {
                                reject('Error al eliminar grupos musculares: ' + error.message);
                            });
                        }

                        // 4. Insertar los nuevos grupos musculares
                        const groupQueries = id_grupo_muscular.map((grupo) => {
                            return new Promise((resolve, reject) => {
                                const queryGrupoMuscular = `
                                    INSERT INTO tb_rutina_grupo_muscular (id_rutina, id_grupo_muscular)
                                    VALUES (?, ?);
                                `;
                                conexion.query(queryGrupoMuscular, [id_rutina, grupo], (error) => {
                                    if (error) {
                                        return reject('Error al asignar grupo muscular: ' + error.message);
                                    }
                                    resolve();
                                });
                            });
                        });

                        Promise.all(groupQueries)
                            .then(() => {
                                // 5. Eliminar los ejercicios actuales para esta rutina
                                const queryEliminarEjercicios = `
                                    DELETE FROM tb_rutina_ejercicios WHERE id_rutina = ?;
                                `;
                                conexion.query(queryEliminarEjercicios, [id_rutina], (error) => {
                                    if (error) {
                                        return conexion.rollback(() => {
                                            reject('Error al eliminar ejercicios: ' + error.message);
                                        });
                                    }

                                    // 6. Insertar los nuevos ejercicios asociados a los grupos musculares
                                    const exerciseQueries = id_ejercicio.map((grupoEjercicio) => {
                                        const { id_grupo_muscular, ejercicios } = grupoEjercicio;

                                        // Insertar cada ejercicio dentro del grupo muscular
                                        const ejercicioQueries = ejercicios.map((ejercicio) => {
                                            return new Promise((resolve, reject) => {
                                                const queryEjercicio = `
                                                    INSERT INTO tb_rutina_ejercicios (id_rutina, id_ejercicios, id_repeticion)
                                                    VALUES (?, ?, ?);
                                                `;
                                                conexion.query(queryEjercicio, [id_rutina, ejercicio.id_ejercicio, ejercicio.id_repeticion], (error) => {
                                                    if (error) {
                                                        return reject('Error al asignar ejercicio: ' + error.message);
                                                    }
                                                    resolve();
                                                });
                                            });
                                        });

                                        // Esperar a que todos los ejercicios del grupo se inserten
                                        return Promise.all(ejercicioQueries);
                                    });

                                    Promise.all(exerciseQueries)
                                        .then(() => {
                                            // Si todo fue exitoso, commit la transacción
                                            conexion.commit((err) => {
                                                if (err) {
                                                    return conexion.rollback(() => {
                                                        reject('Error al hacer commit de la transacción: ' + err.message);
                                                    });
                                                }
                                                resolve('Rutina editada y asignada exitosamente');
                                            });
                                        })
                                        .catch((err) => {
                                            conexion.rollback(() => {
                                                reject(err);
                                            });
                                        });
                                });
                            })
                            .catch((err) => {
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
                return reject('Error al iniciar la transacción');
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

                // 2. Eliminar las relaciones de la rutina en tb_rutina_grupo_muscular
                const queryEliminarGruposMusculares = `
                    DELETE FROM tb_rutina_grupo_muscular WHERE id_rutina = ?;
                `;
                conexion.query(queryEliminarGruposMusculares, [id_rutina], (error) => {
                    if (error) {
                        return conexion.rollback(() => {
                            reject('Error al eliminar grupos musculares asociados a la rutina: ' + error.message);
                        });
                    }

                    // 3. Eliminar la relación de la rutina con el atleta en tb_rutina_atleta
                    const queryEliminarRutinaAtleta = `
                        DELETE FROM tb_rutina_atleta WHERE id_rutina = ?;
                    `;
                    conexion.query(queryEliminarRutinaAtleta, [id_rutina], (error) => {
                        if (error) {
                            return conexion.rollback(() => {
                                reject('Error al eliminar la relación de la rutina con el atleta: ' + error.message);
                            });
                        }

                        // 4. Eliminar la rutina de tb_rutina
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
    });
};



module.exports = {
    listarRutinasFree,
    listarRutinaByIdCreador,
    listarRutinaByIdAtleta,
    crearRutinaYAsignarAtleta,
    editarRutinaYAsignarAtleta,
    eliminarRutinaConRelaciones

};