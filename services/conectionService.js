const conexion = require('../config/conexion');
const bcrypt = require('bcrypt');
//Pool aplicado
// 1. Autenticar usuario
const autenticarUsuario = (email, contrasenia) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = `SELECT * FROM tb_persona WHERE email = ?`;
            connection.query(query, [email], async (error, resultados) => {
                connection.release(); // Liberar la conexión

                if (error) return reject(error);

                // Si se encontró un usuario con ese email
                if (resultados.length > 0) {
                    const usuario = resultados[0];

                    try {
                        // Compara la contraseña proporcionada con el hash almacenado en la base de datos
                        const coinciden = await bcrypt.compare(contrasenia, usuario.password);
                        if (coinciden) {
                            resolve(resultados); // Autenticación exitosa
                        } else {
                            resolve([]); // Contraseña incorrecta
                        }
                    } catch (bcryptError) {
                        reject(bcryptError); // Error al comparar contraseñas
                    }
                } else {
                    resolve([]); // No se encontró ningún usuario con ese email
                }
            });
        });
    });
};

// 2. Obtener usuario logueado
const obtenerUsuarioLogueado = (email) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const queryUsuario = `
                SELECT p.*, a.*, e.* 
                FROM tb_persona p
                LEFT JOIN tb_atleta a ON p.id_persona = a.id_persona
                LEFT JOIN tb_entrenador e ON p.id_persona = e.id_persona
                WHERE p.email = ?
            `;

            connection.query(queryUsuario, [email], (error, resultados) => {
                connection.release(); // Liberar la conexión

                if (error) return reject(error);
                resolve(resultados); // Devuelve los datos del usuario logueado
            });
        });
    });
};

module.exports = {
    autenticarUsuario,
    obtenerUsuarioLogueado,
};