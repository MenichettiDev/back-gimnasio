// Importar el servicio necesario para la consulta
const {
    listarRepeticiones,
    obtenerRepeticionPorId,
    crearRepeticion,
    actualizarRepeticion,
    eliminarRepeticion,
} = require('../services/repeticionService');

// 1. Obtener todas las repeticiones
exports.obtenerRepeticiones = async (req, res) => {
    try {
        const resultados = await listarRepeticiones();

        if (resultados && resultados.length > 0) {
            return res.json(resultados);
        } else {
            return res.status(404).json({ message: 'Repeticiones no encontradas' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

// 2. Obtener una repetición por ID
exports.obtenerRepeticionPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const repeticion = await obtenerRepeticionPorId(id);

        if (repeticion) {
            return res.json(repeticion);
        } else {
            return res.status(404).json({ message: 'Repetición no encontrada' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

// 3. Crear una nueva repetición
exports.crearRepeticion = async (req, res) => {
    try {
        const { nombre, frecuencia, comentario } = req.body;

        if (!nombre || !frecuencia) {
            return res.status(400).json({ message: 'Nombre y frecuencia son campos obligatorios' });
        }

        const nuevoId = await crearRepeticion(nombre, frecuencia, comentario);
        return res.status(201).json({ idRepeticion: nuevoId, message: 'Repetición creada exitosamente' });
    } catch (error) {
        console.error('Error en la creación:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

// 4. Actualizar una repetición existente
exports.actualizarRepeticion = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, frecuencia, comentario } = req.body;

        if (!nombre || !frecuencia) {
            return res.status(400).json({ message: 'Nombre y frecuencia son campos obligatorios' });
        }

        const filasAfectadas = await actualizarRepeticion(id, nombre, frecuencia, comentario);

        if (filasAfectadas > 0) {
            return res.json({ message: 'Repetición actualizada exitosamente' });
        } else {
            return res.status(404).json({ message: 'Repetición no encontrada' });
        }
    } catch (error) {
        console.error('Error en la actualización:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

// 5. Eliminar una repetición
exports.eliminarRepeticion = async (req, res) => {
    try {
        const { id } = req.params;
        const filasAfectadas = await eliminarRepeticion(id);

        if (filasAfectadas > 0) {
            return res.json({ message: 'Repetición eliminada exitosamente' });
        } else {
            return res.status(404).json({ message: 'Repetición no encontrada' });
        }
    } catch (error) {
        console.error('Error en la eliminación:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};