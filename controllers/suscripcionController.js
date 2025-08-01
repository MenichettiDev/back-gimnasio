const { crearSuscripcion } = require('../services/suscripcionService');

async function crearSuscripcionController(req, res) {
    try {
        const { reason, frequency, frequency_type, transaction_amount, currency_id, back_url, payer_email } = req.body;
        const suscripcion = await crearSuscripcion({
            reason,
            frequency,
            frequency_type,
            transaction_amount,
            currency_id,
            payer_email,
            back_url
        });
        res.status(201).json(suscripcion);
    } catch (error) {
        console.error('Error en crearSuscripcionController:', error); // <-- Agrega este log
        res.status(500).json({ error: error.message, details: error });
    }
}

module.exports = { crearSuscripcionController };