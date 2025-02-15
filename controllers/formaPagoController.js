// Importar el servicio necesario para las operaciones de forma de pago
const {
    listarFormasPago,
    obtenerFormaPagoPorId,
    crearFormaPago,
    actualizarFormaPago,
    eliminarFormaPago
} = require('../services/formaPagoService');

// Controlador para listar todas las formas de pago
exports.obtenerFormasPago = async (req, res) => {
    try {
        const formasPago = await listarFormasPago();

        if (formasPago && formasPago.length > 0) {
            return res.json(formasPago);
        } else {
            return res.status(404).json({ message: 'No se encontraron formas de pago' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

// Controlador para obtener una forma de pago por su ID
exports.obtenerFormaPagoById = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de los parámetros de la URL
        const formaPago = await obtenerFormaPagoPorId(id);

        if (formaPago) {
            return res.json(formaPago);
        } else {
            return res.status(404).json({ message: 'Forma de pago no encontrada' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

// Controlador para crear una nueva forma de pago
exports.crearFormaPago = async (req, res) => {
    try {
        const { nombre } = req.body; // Obtener el nombre del cuerpo de la solicitud

        if (!nombre) {
            return res.status(400).json({ message: 'El nombre es requerido' });
        }

        const idFormaPago = await crearFormaPago(nombre);
        return res.status(201).json({ id_forma_pago: idFormaPago, message: 'Forma de pago creada exitosamente' });
    } catch (error) {
        console.error('Error en la creación:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

// Controlador para actualizar una forma de pago existente
exports.actualizarFormaPago = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de los parámetros de la URL
        const { nombre } = req.body; // Obtener el nombre del cuerpo de la solicitud

        if (!nombre) {
            return res.status(400).json({ message: 'El nombre es requerido' });
        }

        const filasAfectadas = await actualizarFormaPago(id, nombre);

        if (filasAfectadas > 0) {
            return res.json({ message: 'Forma de pago actualizada exitosamente' });
        } else {
            return res.status(404).json({ message: 'Forma de pago no encontrada' });
        }
    } catch (error) {
        console.error('Error en la actualización:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};

// Controlador para eliminar una forma de pago
exports.eliminarFormaPago = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de los parámetros de la URL

        const filasAfectadas = await eliminarFormaPago(id);

        if (filasAfectadas > 0) {
            return res.json({ message: 'Forma de pago eliminada exitosamente' });
        } else {
            return res.status(404).json({ message: 'Forma de pago no encontrada' });
        }
    } catch (error) {
        console.error('Error en la eliminación:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};