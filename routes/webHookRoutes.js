const express = require('express');
const { webhookMercadoPago } = require('../controllers/webHookMPController');

const router = express.Router();

router.post('/mercadopago', webhookMercadoPago);

module.exports = router;