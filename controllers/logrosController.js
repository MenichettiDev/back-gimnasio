// Importar el servicio necesario para la consulta
const {
    listarLogros,
    obtenerLogroPorId,
    crearLogro,
    actualizarLogro,
    eliminarLogro,
    listarLogrosPorIdAtleta,
} = require('../services/logrosService');

// 1. Obtener todos los logros
exports.obtenerLogros = async (req, res) => {
    try {
        const resultados = await listarLogros();

        if (resultados && resultados.length > 0) {
            return res.json(resultados);
        } else {
            return res.status(404).json({ message: 'Logros no encontrados' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// 2. Obtener un logro por ID
exports.obtenerLogroPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const logro = await obtenerLogroPorId(id);

        if (logro) {
            return res.json(logro);
        } else {
            return res.status(404).json({ message: 'Logro no encontrado' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// 3. Crear un nuevo logro
exports.crearLogro = async (req, res) => {
    try {
        const { id_atleta, nombre_logro, descripcion_logro, fecha } = req.body;

        if (!id_atleta || !nombre_logro) {
            return res.status(400).json({ message: 'ID del atleta y nombre del logro son campos obligatorios' });
        }

        const nuevoId = await crearLogro(id_atleta, nombre_logro, descripcion_logro, fecha);
        return res.status(201).json({ idLogro: nuevoId, message: 'Logro creado exitosamente' });
    } catch (error) {
        console.error('Error en la creación:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// 4. Actualizar un logro existente
exports.actualizarLogro = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_atleta, nombre_logro, descripcion_logro, fecha } = req.body;

        if (!id_atleta || !nombre_logro) {
            return res.status(400).json({ message: 'ID del atleta y nombre del logro son campos obligatorios' });
        }

        const filasAfectadas = await actualizarLogro(id, id_atleta, nombre_logro, descripcion_logro, fecha);

        if (filasAfectadas > 0) {
            return res.json({ message: 'Logro actualizado exitosamente' });
        } else {
            return res.status(404).json({ message: 'Logro no encontrado' });
        }
    } catch (error) {
        console.error('Error en la actualización:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// 5. Eliminar un logro
exports.eliminarLogro = async (req, res) => {
    try {
        const { id } = req.params;
        const filasAfectadas = await eliminarLogro(id);

        if (filasAfectadas > 0) {
            return res.json({ message: 'Logro eliminado exitosamente' });
        } else {
            return res.status(404).json({ message: 'Logro no encontrado' });
        }
    } catch (error) {
        console.error('Error en la eliminación:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// 6. Listar logros por ID de atleta
exports.listarLogrosPorIdAtleta = async (req, res) => {
    try {
        const { id_atleta } = req.params;
        const logros = await listarLogrosPorIdAtleta(id_atleta);

        if (logros && logros.length > 0) {
            return res.json(logros);
        } else {
            return res.status(404).json({ message: 'No se encontraron logros para este atleta' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};