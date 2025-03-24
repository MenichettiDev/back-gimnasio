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

module.exports = {
    obtenerEntrenadores,
    obtenerEntrenadorPorPersona,
};