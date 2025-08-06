const express = require('express');
const { webhookMercadoPago } = require('../controllers/webHookMP');

const router = express.Router();

router.post('/mercadopago', webhookMercadoPago);

module.exports = router;