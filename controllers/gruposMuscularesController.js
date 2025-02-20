// Importar los servicios necesarios
const {
    listarGruposMusculares,
    obtenerGrupoMuscularPorId,
    crearGrupoMuscular,
    actualizarGrupoMuscular,
    eliminarGrupoMuscular
} = require('../services/gruposMuscularesService');

// 1. Controlador para Listar Grupos Musculares (Ya implementado)
exports.obtenerGruposMusculares = async (req, res) => {
    try {
        const resultados = await listarGruposMusculares();

        if (resultados && resultados.length > 0) {
            return res.json(resultados);
        } else {
            return res.status(404).json({ message: 'Grupos musculares no encontrados' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

// 2. Controlador para Obtener un Grupo Muscular por ID
exports.obtenerGrupoMuscular = async (req, res) => {
    try {
        const { id } = req.params;
        const grupoMuscular = await obtenerGrupoMuscularPorId(id);

        if (grupoMuscular) {
            return res.json(grupoMuscular);
        } else {
            return res.status(404).json({ message: 'Grupo muscular no encontrado' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

// 3. Controlador para Crear un Nuevo Grupo Muscular
exports.crearGrupoMuscular = async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ message: 'El nombre del grupo muscular es requerido' });
        }

        const nuevoId = await crearGrupoMuscular(nombre);
        return res.status(201).json({ id_grupo_muscular: nuevoId, message: 'Grupo muscular creado exitosamente' });
    } catch (error) {
        console.error('Error en la creación:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

// 4. Controlador para Actualizar un Grupo Muscular Existente
exports.actualizarGrupoMuscular = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ message: 'El nombre del grupo muscular es requerido' });
        }

        const filasAfectadas = await actualizarGrupoMuscular(id, nombre);

        if (filasAfectadas > 0) {
            return res.json({ message: 'Grupo muscular actualizado exitosamente' });
        } else {
            return res.status(404).json({ message: 'Grupo muscular no encontrado' });
        }
    } catch (error) {
        console.error('Error en la actualización:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

// 5. Controlador para Eliminar un Grupo Muscular
exports.eliminarGrupoMuscular = async (req, res) => {
    try {
        const { id } = req.params;
        const filasAfectadas = await eliminarGrupoMuscular(id);

        if (filasAfectadas > 0) {
            return res.json({ message: 'Grupo muscular eliminado exitosamente' });
        } else {
            return res.status(404).json({ message: 'Grupo muscular no encontrado' });
        }
    } catch (error) {
        console.error('Error en la eliminación:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};