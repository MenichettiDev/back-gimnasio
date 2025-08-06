const { crearSuscripcion } = require('../services/suscripcionService');

async function crearSuscripcionController(req, res) {
    try {
        const { reason, frequency, frequency_type,
            transaction_amount, currency_id, back_url, payer_email, id_persona } = req.body;
        const suscripcion = await crearSuscripcion({
            reason,
            frequency,
            frequency_type,
            transaction_amount,
            currency_id,
            payer_email,
            back_url,
            id_persona
        });
        res.status(201).json(suscripcion);
    } catch (error) {
        console.error('Error en crearSuscripcionController:', error); // <-- Agrega este log
        res.status(500).json({ error: error.message, details: error, error: error.message });
    }
}

module.exports = { crearSuscripcionController };