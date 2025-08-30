const express = require('express');
const router = express.Router();
const ejercicioController = require('../controllers/ejercicioController');

// Wrapper que muestra headers antes, ejecuta multer y muestra req.body/req.files después
router.post('/ejercicios-with-files', (req, res, next) => {
    console.log('Incoming headers (before multer):', req.headers['content-type']);
    ejercicioController.upload(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ message: 'Error al procesar archivos', error: err.message });
        }
        console.log('After multer -> headers Content-Type:', req.headers['content-type']);
        console.log('After multer -> req.body:', req.body);
        console.log('After multer -> req.files:', req.files);
        next();
    });
}, ejercicioController.createEjercicioWithFiles);

module.exports = router;
