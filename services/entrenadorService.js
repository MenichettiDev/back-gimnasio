const conexion = require('../config/conexion');



const obtenerEntrenadores = () => {
    return new Promise((resolve, reject) => {
        const queryPersonas = 'SELECT * FROM tb_entrenador, tb_persona WHERE tb_persona.dni = tb_entrenador.dni'; // Aquí eliminamos la condición del email
        conexion.query(queryPersonas, (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); // Devuelve los datos de todas las personas
        });
    });
};

const obtenerEntrenadorPorPersona = ( idPersona ) => {
    return new Promise(( resolve, reject ) => {
        const queryEntrenador = 'SELECT * FROM tb_entrenador WHERE id_persona = ?'; // Filtramos por id_persona
        conexion.query(queryEntrenador, [idPersona], (error, resultados) => {
            if (error) return reject(error);
            resolve( resultados ); // Devuelve el entrenador relacionado con la id_persona
        });
    });
};


module.exports = {
    obtenerEntrenadores,
    obtenerEntrenadorPorPersona,

};