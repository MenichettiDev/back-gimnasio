const mercadopago = require('mercadopago');
const { crearPago } = require('./pagoService');
const conexion = require('../config/conexion');

async function procesarPagoMercadoPago(paymentId) {
    try {
        // Obtener info del pago desde MP
        const client = new mercadopago.MercadoPagoConfig({
            accessToken: process.env.MP_ACCESS_TOKEN
        });
        const payment = new mercadopago.Payment(client);
        const paymentInfo = await payment.get({ id: paymentId });

        console.log('Pago obtenido de MP:', paymentInfo);

        // Solo procesar pagos aprobados
        if (paymentInfo.status === 'approved') {
            // Extraer id_persona del external_reference
            const id_persona = paymentInfo.external_reference.split('_')[0];
            
            // Buscar persona por ID en lugar de email
            const persona = await buscarPersonaPorId(id_persona);

            if (persona) {
                // Crear registro en tb_pago
                const nuevoPago = {
                    id_atleta: persona.id_persona, // Cambiar: usar id_persona
                    id_entrenador: null,
                    id_gimnasio: null,
                    fecha_pago: new Date(),
                    monto: paymentInfo.transaction_amount,
                    id_forma_pago: 3,
                    concepto: `Pago suscripción MP - ${paymentInfo.description}`,
                    mp_payment_id: paymentId,
                    mp_status: paymentInfo.status,
                    mp_preapproval_id: paymentInfo.preapproval_id
                };

                const idPago = await crearPago(nuevoPago);

                if (idPago) {
                    // Actualizar fecha_ultimo_pago y activo del atleta
                    await actualizarAtletaPago(persona.id_persona);
                    console.log(`Pago procesado exitosamente para persona ${persona.id_persona}`);
                }
            } else {
                console.log(`No se encontró persona con ID: ${id_persona}`);
            }
        }

    } catch (error) {
        console.error('Error procesando pago MP:', error);
        throw error;
    }
}

function buscarPersonaPorId(id_persona) {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT * FROM tb_persona WHERE id_persona = ?';
            connection.query(query, [id_persona], (error, resultados) => {
                connection.release();
                if (error) return reject(error);
                resolve(resultados[0]);
            });
        });
    });
}

function actualizarAtletaPago(id_persona) {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = `
                UPDATE tb_persona 
                SET ultimo_pago = NOW(), activo = 1 
                WHERE id_persona = ?
            `;

            connection.query(query, [id_persona], (error, resultados) => {
                connection.release();
                if (error) return reject(error);
                resolve(resultados);
            });
        });
    });
}

module.exports = { procesarPagoMercadoPago };