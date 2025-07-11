// Importar los servicios necesarios para las operaciones de pagos
const {
    obtenerPagosPorAtleta,
    obtenerPagoPorId,
    crearPago,
    actualizarPago,
    eliminarPagoPorId,
    obtenerPagosPorFecha,
    obtenerTotalPagosPorAtleta
} = require('../services/pagoService');


// 1. Obtener todos los pagos de un atleta específico
exports.getPagosPorAtleta = async (req, res) => {
    const { id_atleta } = req.body; // Obtener el id_atleta desde el cuerpo de la solicitud

    if (!id_atleta) {
        return res.status(400).json({ message: 'El id_atleta es obligatorio' });
    }

    try {
        const pagos = await obtenerPagosPorAtleta(id_atleta);

        if (pagos && pagos.length > 0) {
            return res.json(pagos); // Devuelve todos los pagos del atleta
        } else {
            return res.status(404).json({ message: 'No se encontraron pagos para este atleta' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};


// 2. Obtener un pago por su ID
exports.getPagoPorId = async (req, res) => {
    const { id_pago } = req.body; // Obtener el id_pago desde el cuerpo de la solicitud

    if (!id_pago) {
        return res.status(400).json({ message: 'El id_pago es obligatorio' });
    }

    try {
        const pago = await obtenerPagoPorId(id_pago);

        if (pago) {
            return res.json(pago); // Devuelve el pago encontrado
        } else {
            return res.status(404).json({ message: 'No se encontró el pago con este ID' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};


// 3. Crear un nuevo pago
exports.createPago = async (req, res) => {
    const { id_atleta, id_entrenador, id_gimnasio, id_membresia, fecha_pago, monto, id_forma_pago, concepto } = req.body;
    if (!fecha_pago || !monto || !id_forma_pago) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const nuevoPago = { id_atleta, id_entrenador, id_gimnasio, fecha_pago, monto, id_forma_pago, concepto };
        const idPagoCreado = await crearPago(nuevoPago);
        console.log('pago creado', idPagoCreado)
        if (idPagoCreado) {
            return res.status(201).json({ message: 'Pago creado exitosamente', id: idPagoCreado });
        } else {
            return res.status(400).json({ message: 'No se pudo crear el pago' });
        }
    } catch (error) {
        console.error('Error al crear el pago:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};


// 4. Actualizar un pago existente
exports.updatePago = async (req, res) => {
    const { id_pago, id_atleta, id_membresia, fecha_pago, monto, id_forma_pago } = req.body;

    if (!id_pago) {
        return res.status(400).json({ message: 'El id_pago es obligatorio' });
    }

    try {
        const pagoActualizado = { id_pago, id_atleta, id_membresia, fecha_pago, monto, id_forma_pago };
        const resultados = await actualizarPago(pagoActualizado);

        if (resultados.affectedRows > 0) {
            return res.json({ message: 'Pago actualizado exitosamente' });
        } else {
            return res.status(404).json({ message: 'No se encontró el pago para actualizar' });
        }
    } catch (error) {
        console.error('Error en la actualización:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};


// 5. Eliminar un pago por su ID
exports.deletePago = async (req, res) => {
    const { id_pago } = req.body;

    if (!id_pago) {
        return res.status(400).json({ message: 'El id_pago es obligatorio' });
    }

    try {
        const resultados = await eliminarPagoPorId(id_pago);

        if (resultados.affectedRows > 0) {
            return res.json({ message: 'Pago eliminado exitosamente' });
        } else {
            return res.status(404).json({ message: 'No se encontró el pago para eliminar' });
        }
    } catch (error) {
        console.error('Error en la eliminación:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};


// 6. Obtener todos los pagos realizados en una fecha específica
exports.getPagosPorFecha = async (req, res) => {
    const { fecha } = req.body; // Obtener la fecha desde el cuerpo de la solicitud

    if (!fecha) {
        return res.status(400).json({ message: 'La fecha es obligatoria' });
    }

    try {
        const pagos = await obtenerPagosPorFecha(fecha);

        if (pagos && pagos.length > 0) {
            return res.json(pagos); // Devuelve los pagos encontrados
        } else {
            return res.status(404).json({ message: 'No se encontraron pagos para esta fecha' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};


// 7. Obtener el total de pagos realizados por un atleta
exports.getTotalPagosPorAtleta = async (req, res) => {
    const { id_atleta } = req.body; // Obtener el id_atleta desde el cuerpo de la solicitud

    if (!id_atleta) {
        return res.status(400).json({ message: 'El id_atleta es obligatorio' });
    }

    try {
        const totalPagos = await obtenerTotalPagosPorAtleta(id_atleta);
        return res.json({ totalPagos }); // Devuelve el total de pagos
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};