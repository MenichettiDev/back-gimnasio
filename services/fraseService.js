const conexion = require('../config/conexion');

// Obtener una frase aleatoria
const fraseAleatoria = () => {
    return new Promise((resolve, reject) => {
        // Obtener una conexión del pool
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryFraseAleatoria = `
                SELECT * 
                FROM tb_frases 
                ORDER BY RAND() 
                LIMIT 1
            `;

            // Ejecutar la consulta
            connection.query(queryFraseAleatoria, (error, resultados) => {
                // Liberar la conexión después de usarla
                connection.release();

                if (error) return reject(error);
                resolve(resultados); // Devuelve la primera frase (única fila aleatoria)
            });
        });
    });
};

module.exports = {
    fraseAleatoria
};