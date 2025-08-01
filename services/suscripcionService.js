const mercadopago = require('mercadopago');

async function crearSuscripcion({ payer_email, reason, frequency, frequency_type, transaction_amount, currency_id, back_url }) {
    const preference = {
        reason,
        auto_recurring: {
            frequency,
            frequency_type,
            transaction_amount,
            currency_id
        },
        payer_email,
        back_url
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