const conexion = require('../config/conexion');

// 1. Listar todas las medidas
const listarMedidas = () => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT * FROM tb_medidas';
            connection.query(query, (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve todas las medidas
            });
        });
    });
};

// 2. Obtener una medida por ID
const obtenerMedidaPorId = (id_medida) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT * FROM tb_medidas WHERE id_medida = ?';
            connection.query(query, [id_medida], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados[0]); // Devuelve la primera coincidencia (única)
            });
        });
    });
};

// 3. Obtener todas las medidas de un atleta por su ID
const obtenerMedidasPorAtleta = (id_atleta) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT * FROM tb_medidas WHERE id_atleta = ?';
            connection.query(query, [id_atleta], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados); // Devuelve todas las medidas del atleta
            });
        });
    });
};

// 4. Crear una nueva medida
const crearMedida = (id_atleta, fecha_medicion, peso, altura, biceps, pecho, hombros, cintura, gluteos, cuadriceps, gemelos, antebrazo, cuello, grasa_corporal) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = `
                INSERT INTO tb_medidas 
                (id_atleta, fecha_medicion, peso, altura, biceps, pecho, hombros, cintura, gluteos, cuadriceps, gemelos, antebrazo, cuello, grasa_corporal) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            connection.query(query, [id_atleta, fecha_medicion, peso, altura, biceps, pecho, hombros, cintura, gluteos, cuadriceps, gemelos, antebrazo, cuello, grasa_corporal], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados.insertId); // Devuelve el ID de la nueva medida
            });
        });
    });
};

// 5. Actualizar una medida existente
const actualizarMedida = (id_medida, id_atleta, fecha_medicion, peso, altura, biceps, pecho, hombros, cintura, gluteos, cuadriceps, gemelos, antebrazo, cuello, grasa_corporal) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = `
                UPDATE tb_medidas 
                SET id_atleta = ?, fecha_medicion = ?, peso = ?, altura = ?, biceps = ?, pecho = ?, hombros = ?, cintura = ?, gluteos = ?, cuadriceps = ?, gemelos = ?, antebrazo = ?, cuello = ?, grasa_corporal = ? 
                WHERE id_medida = ?
            `;
            connection.query(query, [id_atleta, fecha_medicion, peso, altura, biceps, pecho, hombros, cintura, gluteos, cuadriceps, gemelos, antebrazo, cuello, grasa_corporal, id_medida], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados.affectedRows); // Devuelve el número de filas afectadas
            });
        });
    });
};

// 6. Eliminar una medida
const eliminarMedida = (id) => {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'DELETE FROM tb_medidas WHERE id_medida = ?';
            connection.query(query, [id], (error, resultados) => {
                connection.release(); // Liberar la conexión
                if (error) return reject(error);
                resolve(resultados.affectedRows); // Devuelve el número de filas afectadas
            });
        });
    });
};

module.exports = {
    listarMedidas,
    obtenerMedidaPorId,
    obtenerMedidasPorAtleta,
    crearMedida,
    actualizarMedida,
    eliminarMedida,
};