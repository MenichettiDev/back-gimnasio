const mercadopago = require('mercadopago');
const { crearPago } = require('./pagoService');
const conexion = require('../config/conexion');

async function procesarPagoMercadoPago(paymentId) {
    try {
        console.log(`Procesando pago ID: ${paymentId}`);

        // Obtener info del pago desde MP
        const client = new mercadopago.MercadoPagoConfig({
            accessToken: process.env.MP_ACCESS_TOKEN
        });
        const payment = new mercadopago.Payment(client);
        const paymentInfo = await payment.get({ id: paymentId });

        console.log('Pago obtenido de MP:', JSON.stringify(paymentInfo, null, 2));

        // Solo procesar pagos aprobados
        if (paymentInfo.status === 'approved') {
            // Extraer id_persona del external_reference
            const id_persona = paymentInfo.external_reference.split('_')[0];
            console.log(`ID persona extraído: ${id_persona}`);

            // Buscar persona por ID
            const persona = await buscarPersonaPorId(id_persona);

            if (persona) {
                console.log(`Persona encontrada: ${persona.nombre}`);

                // Crear registro en tb_pago
                const nuevoPago = {
                    id_persona: persona.id_persona,
                    fecha_pago: new Date(),
                    monto: paymentInfo.transaction_amount,
                    id_forma_pago: 1, // MercadoPago
                    concepto: `Pago suscripción MP - ${paymentInfo.description || 'Suscripción mensual'}`,
                    mp_payment_id: paymentId,
                    mp_status: paymentInfo.status,
                    mp_subscription_id: paymentInfo.point_of_interaction?.transaction_data?.subscription_id || null
                };

                console.log('Datos del pago a crear:', nuevoPago);

                const idPago = await crearPago(nuevoPago);
                console.log(`Resultado de crearPago: ${idPago}`);

                if (idPago) {
                    // Actualizar fecha_ultimo_pago y activo del atleta
                    await actualizarAtletaPago(persona.id_persona);
                    console.log(`Pago procesado exitosamente para persona ${persona.id_persona}, ID pago: ${idPago}`);
                } else {
                    console.error('Error: No se pudo crear el registro de pago');
                }
            } else {
                console.error(`No se encontró persona con ID: ${id_persona}`);
            }
        } else {
            console.log(`Pago no aprobado. Status: ${paymentInfo.status}`);
        }

    } catch (error) {
        console.error('Error procesando pago MP:', error);
        throw error;
    }
}

async function procesarPreapprovalMercadoPago(preapprovalId) {
    try {
        console.log(`Procesando preapproval ID: ${preapprovalId}`);

        // Obtener info de la preaprobación desde MP
        const client = new mercadopago.MercadoPagoConfig({
            accessToken: process.env.MP_ACCESS_TOKEN
        });
        const preapproval = new mercadopago.PreApproval(client);
        const preapprovalInfo = await preapproval.get({ id: preapprovalId });

        console.log('Preapproval obtenido de MP:', JSON.stringify(preapprovalInfo, null, 2));

        // Procesar según el status de la suscripción
        if (preapprovalInfo.status === 'authorized') {
            console.log('Suscripción autorizada, buscando pagos asociados...');

            // Buscar pagos asociados a esta preaprobación
            await buscarPagosDePreapproval(preapprovalId, preapprovalInfo.external_reference);
        } else {
            console.log(`Preapproval no autorizada. Status: ${preapprovalInfo.status}`);
        }

    } catch (error) {
        console.error('Error procesando preapproval MP:', error);
        throw error;
    }
}

async function buscarPagosDePreapproval(preapprovalId, external_reference) {
    try {
        const client = new mercadopago.MercadoPagoConfig({
            accessToken: process.env.MP_ACCESS_TOKEN
        });
        const payment = new mercadopago.Payment(client);

        // Buscar pagos asociados a esta preaprobación
        const searchParams = {
            preapproval_id: preapprovalId,
            status: 'approved'
        };

        const payments = await payment.search({ options: searchParams });
        console.log(`Encontrados ${payments.results.length} pagos para preapproval ${preapprovalId}`);

        // Procesar cada pago encontrado
        for (const paymentInfo of payments.results) {
            console.log(`Procesando pago ${paymentInfo.id} de la suscripción`);

            // Extraer id_persona del external_reference
            const id_persona = external_reference.split('_')[0];

            // Verificar si este pago ya fue procesado
            const pagoExistente = await verificarPagoExistente(paymentInfo.id);
            if (pagoExistente) {
                console.log(`Pago ${paymentInfo.id} ya fue procesado anteriormente`);
                continue;
            }

            const persona = await buscarPersonaPorId(id_persona);

            if (persona) {
                const nuevoPago = {
                    id_atleta: persona.id_persona,
                    id_entrenador: null,
                    id_gimnasio: null,
                    fecha_pago: new Date(paymentInfo.date_created),
                    monto: paymentInfo.transaction_amount,
                    id_forma_pago: 1,
                    concepto: `Pago suscripción MP - ${paymentInfo.description || 'Suscripción mensual'}`,
                    activo: 1,
                    mp_payment_id: paymentInfo.id,
                    mp_status: paymentInfo.status,
                    mp_preapproval_id: preapprovalId
                };

                const idPago = await crearPago(nuevoPago);

                if (idPago) {
                    await actualizarAtletaPago(persona.id_persona);
                    console.log(`Pago de suscripción procesado: ${paymentInfo.id}`);
                }
            }
        }

    } catch (error) {
        console.error('Error buscando pagos de preapproval:', error);
    }
}

function verificarPagoExistente(mp_payment_id) {
    return new Promise((resolve, reject) => {
        conexion.getConnection((err, connection) => {
            if (err) return reject(err);

            const query = 'SELECT id_pago FROM tb_pago WHERE mp_payment_id = ?';
            connection.query(query, [mp_payment_id], (error, resultados) => {
                connection.release();
                if (error) return reject(error);
                resolve(resultados.length > 0);
            });
        });
    });
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
                if (error) {
                    console.error('Error actualizando persona:', error);
                    return reject(error);
                }
                console.log(`Persona ${id_persona} actualizada: ultimo_pago y activo`);
                resolve(resultados);
            });
        });
    });
}

module.exports = { procesarPagoMercadoPago, procesarPreapprovalMercadoPago };