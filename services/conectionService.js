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
                connection.release();
                if (error) return reject(error);
                if (resultados.length === 0) return resolve(null); // No existe el email

                const usuario = resultados[0];

                try {
                    const coinciden = await bcrypt.compare(contrasenia, usuario.password);
                    if (coinciden) {
                        resolve(usuario); // Usuario válido
                    } else {
                        resolve(null); // Contraseña incorrecta
                    }
                } catch (err) {
                    reject(err);
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
                SELECT 
                    p.id_persona,
                    p.dni,
                    p.id_acceso,
                    p.nombre,
                    p.apellido,
                    p.apodo,
                    p.fecha_nacimiento,
                    p.fecha_registro,
                    p.celular,
                    p.direccion,
                    p.email,
                    p.password,
                    a.id_atleta,
                    a.id_entrenador,
                    a.id_gimnasio,
                    a.estado,
                    a.fecha_registro,
                    a.ultimo_pago,
                    e.id_entrenador,
                    g.id_gimnasio
                FROM tb_persona p
                LEFT JOIN tb_atleta a ON p.id_persona = a.id_persona
                LEFT JOIN tb_entrenador e ON p.id_persona = e.id_persona
                LEFT JOIN tb_gimnasio g ON p.id_persona = g.id_persona
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