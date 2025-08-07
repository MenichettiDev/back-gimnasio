const { procesarPagoMercadoPago, procesarPreapprovalMercadoPago } = require('../services/webHookMPService');

async function webhookMercadoPago(req, res) {
    try {
        console.log('Webhook recibido:', req.body);

        const { type, data } = req.body;

        // Procesar según el tipo de evento
        if (type === 'payment') {
            console.log('Procesando pago individual...');
            await procesarPagoMercadoPago(data.id);
        } else if (type === 'preapproval') {
            console.log('Procesando evento de suscripción...');
            await procesarPreapprovalMercadoPago(data.id);
        }

        // Siempre responder 200 para que MP no reintente
        res.status(200).send('OK');
    } catch (error) {
        console.error('Error en webhook:', error);
        res.status(200).send('OK'); // Aún con error, responder OK
    }
}

module.exports = { webhookMercadoPago };