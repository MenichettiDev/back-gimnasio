const conexion = require('../config/conexion');



const listarAtletas = () => {
    return new Promise((resolve, reject) => {
        const queryPersonas = 'SELECT * FROM tb_atleta'; // Aquí eliminamos la condición del email
        conexion.query(queryPersonas, (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); // Devuelve los datos de todas las personas
        });
    });
};

const listarAtletasPorIdEntrenador = ( idEntrenador ) => {
    return new Promise(( resolve, reject ) => {
        const queryAtletas = 'SELECT * FROM tb_atleta WHERE id_entrenador = ?'; // Filtramos por id_entrenador
        conexion.query( queryAtletas, [idEntrenador], ( error, resultados ) => {
            if ( error ) return reject( error );
            resolve( resultados ); // Devuelve los atletas que están relacionados con el id_entrenador
        });
    });
};
