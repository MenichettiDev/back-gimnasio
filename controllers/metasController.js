// Importar el servicio necesario para la consulta
const {
    listarMetas,
    obtenerMetaPorId,
    crearMeta,
    actualizarMeta,
    eliminarMeta,
    listarMetasPorIdAtleta,
} = require('../services/metasService');

// 1. Obtener todas las metas
exports.obtenerMetas = async (req, res) => {
    try {
        const resultados = await listarMetas();

        if (resultados && resultados.length > 0) {
            return res.json(resultados);
        } else {
            return res.status(404).json({ message: 'Metas no encontradas' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// 2. Obtener una meta por ID
exports.obtenerMetaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const meta = await obtenerMetaPorId(id);

        if (meta) {
            return res.json(meta);
        } else {
            return res.status(404).json({ message: 'Meta no encontrada' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// 3. Crear una nueva meta
exports.crearMeta = async (req, res) => {
    try {
        const { id_atleta, descripcion, tipo_meta, valor_objetivo, fecha_establecimiento, fecha_vencimiento, estado } = req.body;

        if (!id_atleta || !descripcion || !tipo_meta || !valor_objetivo) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const nuevoId = await crearMeta(id_atleta, descripcion, tipo_meta, valor_objetivo, fecha_establecimiento, fecha_vencimiento, estado);
        return res.status(201).json({ idMeta: nuevoId, message: 'Meta creada exitosamente' });
    } catch (error) {
        console.error('Error en la creación:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// 4. Actualizar una meta existente
exports.actualizarMeta = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_atleta, descripcion, tipo_meta, valor_objetivo, fecha_establecimiento, fecha_vencimiento, estado } = req.body;

        if (!id_atleta || !descripcion || !tipo_meta || !valor_objetivo) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const filasAfectadas = await actualizarMeta(id, id_atleta, descripcion, tipo_meta, valor_objetivo, fecha_establecimiento, fecha_vencimiento, estado);

        if (filasAfectadas > 0) {
            return res.json({ message: 'Meta actualizada exitosamente' });
        } else {
            return res.status(404).json({ message: 'Meta no encontrada' });
        }
    } catch (error) {
        console.error('Error en la actualización:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// 5. Eliminar una meta
exports.eliminarMeta = async (req, res) => {
    try {
        const { id } = req.params;
        const filasAfectadas = await eliminarMeta(id);

        if (filasAfectadas > 0) {
            return res.json({ message: 'Meta eliminada exitosamente' });
        } else {
            return res.status(404).json({ message: 'Meta no encontrada' });
        }
    } catch (error) {
        console.error('Error en la eliminación:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// 6. Listar metas por ID de atleta
exports.listarMetasPorIdAtleta = async (req, res) => {
    try {
        const { id_atleta } = req.params;
        const metas = await listarMetasPorIdAtleta(id_atleta);

        if (metas && metas.length > 0) {
            return res.json(metas);
        } else {
            return res.status(404).json({ message: 'No se encontraron metas para este atleta' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};