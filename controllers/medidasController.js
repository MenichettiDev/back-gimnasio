// Importar el servicio necesario para la consulta
const {
    listarMedidas,
    obtenerMedidaPorId,
    obtenerMedidasPorAtleta,
    crearMedida,
    actualizarMedida,
    eliminarMedida,
} = require('../services/medidasService');

// 1. Obtener todas las medidas
exports.obtenerMedidas = async (req, res) => {
    try {
        const resultados = await listarMedidas();

        if (resultados && resultados.length > 0) {
            return res.json(resultados);
        } else {
            return res.status(404).json({ message: 'Medidas no encontradas' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// 2. Obtener una medida por ID
exports.obtenerMedidaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const medida = await obtenerMedidaPorId(id);

        if (medida) {
            return res.json(medida);
        } else {
            return res.status(404).json({ message: 'Medida no encontrada' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// 3. Obtener todas las medidas de un atleta por su ID
exports.obtenerMedidasPorAtleta = async (req, res) => {
    try {
        const { id_atleta } = req.params;
        const medidas = await obtenerMedidasPorAtleta(id_atleta);

        if (medidas && medidas.length > 0) {
            return res.json(medidas);
        } else {
            return res.status(404).json({ message: 'No se encontraron medidas para este atleta' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// 4. Crear una nueva medida
exports.crearMedida = async (req, res) => {
    try {
        const { id_atleta, fecha_medicion, peso, altura, biceps, pecho, hombros, cintura, gluteos, cuadriceps, gemelos, antebrazo, cuello, grasa_corporal } = req.body;

        // Validar campos obligatorios
        if (!id_atleta || !fecha_medicion || !peso || !altura) {
            return res.status(400).json({ message: 'id_atleta, fecha_medicion, peso y altura son campos obligatorios' });
        }

        const nuevoId = await crearMedida(id_atleta, fecha_medicion, peso, altura, biceps, pecho, hombros, cintura, gluteos, cuadriceps, gemelos, antebrazo, cuello, grasa_corporal);
        return res.status(201).json({ idMedida: nuevoId, message: 'Medida creada exitosamente' });
    } catch (error) {
        console.error('Error en la creación:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// 5. Actualizar una medida existente
exports.actualizarMedida = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_atleta, fecha_medicion, peso, altura, biceps, pecho, hombros, cintura, gluteos, cuadriceps, gemelos, antebrazo, cuello, grasa_corporal } = req.body;

        // Validar campos obligatorios
        if (!id_atleta || !fecha_medicion || !peso || !altura) {
            return res.status(400).json({ message: 'id_atleta, fecha_medicion, peso y altura son campos obligatorios' });
        }

        const filasAfectadas = await actualizarMedida(id, id_atleta, fecha_medicion, peso, altura, biceps, pecho, hombros, cintura, gluteos, cuadriceps, gemelos, antebrazo, cuello, grasa_corporal);

        if (filasAfectadas > 0) {
            return res.json({ message: 'Medida actualizada exitosamente' });
        } else {
            return res.status(404).json({ message: 'Medida no encontrada' });
        }
    } catch (error) {
        console.error('Error en la actualización:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// 6. Eliminar una medida
exports.eliminarMedida = async (req, res) => {
    try {
        const { id } = req.params;
        const filasAfectadas = await eliminarMedida(id);

        if (filasAfectadas > 0) {
            return res.json({ message: 'Medida eliminada exitosamente' });
        } else {
            return res.status(404).json({ message: 'Medida no encontrada' });
        }
    } catch (error) {
        console.error('Error en la eliminación:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};