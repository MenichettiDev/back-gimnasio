const mercadopago = require('mercadopago');

async function crearSuscripcion({ payer_email, reason,
    frequency, frequency_type, transaction_amount,
    currency_id, back_url, id_persona }) {
    const preference = {
        reason,
        auto_recurring: {
            frequency,
            frequency_type,
            transaction_amount,
            currency_id
        },
        payer_email,
        back_url: `${back_url}?user_id=${id_persona}&payment_success=true`,
        notification_url: `${process.env.BASE_URL}/webhooks/mercadopago`,
        external_reference: `${id_persona}_${Date.now()}`
    };

    try {
        const client = new mercadopago.MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const preapproval = new mercadopago.PreApproval(client);
        const response = await preapproval.create({ body: preference });
        return response;
    } catch (error) {
        throw error;
    }
}

module.exports = { crearSuscripcion };