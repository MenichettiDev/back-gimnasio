const { procesarPagoMercadoPago } = require('../services/webHookMP');

async function webhookMercadoPago(req, res) {
    try {
        console.log('Webhook recibido:', req.body);

        const { type, data } = req.body;

        // Solo procesar eventos de pago
        if (type === 'payment') {
            await procesarPagoMercadoPago(data.id);
        }

        // Siempre responder 200 para que MP no reintente
        res.status(200).send('OK');
    } catch (error) {
        console.error('Error en webhook:', error);
        res.status(200).send('OK'); // Aún con error, responder OK
    }
}

module.exports = { webhookMercadoPago };