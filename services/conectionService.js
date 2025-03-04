const conexion = require('../config/conexion');
const bcrypt = require('bcrypt');

const autenticarUsuario = ( email, contrasenia ) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM tb_persona where email = ?`;
        conexion.query(query, [email], async (error, resultados) => {
            if (error) return reject(error);
            //Si se encontró un médico con esa matrícula
            if (resultados.length > 0) {
                const usuario = resultados[0];
                //Compara la contraseña proporcionada con el hash almacenado en la base de datos
                const coinciden = await bcrypt.compare(contrasenia, usuario.password);
                if (coinciden) {
                    resolve(resultados); //Autenticación exitosa
                } else {
                    resolve([]); //Contraseña incorrecta
                }
            } else {
                resolve([]); //No se encontró ningún médico con esa matrícula
            }
        });
    });
};

const obtenerUsuarioLogueado = (email) => {
    return new Promise((resolve, reject) => {
        const queryUsuario = `
            SELECT p.*, a.*, e.* 
            FROM tb_persona p
            LEFT JOIN tb_atleta a ON p.id_persona = a.id_persona
            LEFT JOIN tb_entrenador e ON p.id_persona = e.id_persona
            WHERE p.email = ?
        `;
        conexion.query(queryUsuario, [email], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados); // Devuelve los datos del usuario logueado
        });
    });
};


module.exports = {
    autenticarUsuario,
    obtenerUsuarioLogueado, //Exporta la función para obtener los datos del médico logueado
};
