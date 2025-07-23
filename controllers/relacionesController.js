const relacionesService = require('../services/relacionesService');

// Solicitar relación atleta-entrenador
exports.solicitarAtletaEntrenador = async (req, res) => {
    try {
        const { id_atleta, id_entrenador } = req.body;
        const result = await relacionesService.solicitarAtletaEntrenador(id_atleta, id_entrenador);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Solicitar relación atleta-gimnasio
exports.solicitarAtletaGimnasio = async (req, res) => {
    try {
        const { id_atleta, id_gimnasio } = req.body;
        const result = await relacionesService.solicitarAtletaGimnasio(id_atleta, id_gimnasio);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Solicitar relación entrenador-gimnasio
exports.solicitarEntrenadorGimnasio = async (req, res) => {
    try {
        const { id_entrenador, id_gimnasio } = req.body;
        const result = await relacionesService.solicitarEntrenadorGimnasio(id_entrenador, id_gimnasio);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener solicitudes pendientes para entrenador
exports.getSolicitudesPendientesEntrenador = async (req, res) => {
    try {
        const { id_entrenador } = req.body;
        const result = await relacionesService.getSolicitudesPendientesEntrenador(id_entrenador);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener solicitudes pendientes para atleta
exports.getSolicitudesPendientesAtleta = async (req, res) => {
    try {
        const { id_atleta } = req.body;
        const result = await relacionesService.getSolicitudesPendientesAtleta(id_atleta);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener solicitudes pendientes para gimnasio
exports.getSolicitudesPendientesGimnasio = async (req, res) => {
    try {
        const { id_gimnasio } = req.body;
        const result = await relacionesService.getSolicitudesPendientesGimnasio(id_gimnasio);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Aceptar/rechazar solicitud atleta-entrenador
exports.responderSolicitudAtletaEntrenador = async (req, res) => {
    try {
        const { id, activo } = req.body;
        const result = await relacionesService.responderSolicitudAtletaEntrenador(id, activo);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Aceptar/rechazar solicitud atleta-gimnasio
exports.responderSolicitudAtletaGimnasio = async (req, res) => {
    try {
        const { id, activo } = req.body;
        const result = await relacionesService.responderSolicitudAtletaGimnasio(id, activo);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Aceptar/rechazar solicitud entrenador-gimnasio
exports.responderSolicitudEntrenadorGimnasio = async (req, res) => {
    try {
        const { id, activo } = req.body;
        const result = await relacionesService.responderSolicitudEntrenadorGimnasio(id, activo);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
