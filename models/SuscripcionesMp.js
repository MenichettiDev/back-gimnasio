class SuscripcionesMp {
    constructor(data = {}) {
        this.id = data.id || null;
        this.id_persona = data.id_persona || null;
        this.mp_subscription_id = data.mp_subscription_id || null;
        this.mp_preapproval_id = data.mp_preapproval_id || null;
        this.estado = data.estado || 'activa';
        this.tipo_plan = data.tipo_plan || 'mensual';
        this.monto_mensual = data.monto_mensual || null;
        this.fecha_inicio = data.fecha_inicio || null;
        this.fecha_fin = data.fecha_fin || null;
        this.activa = data.activa || true;
        this.external_reference = data.external_reference || null;
        this.fecha_creacion = data.fecha_creacion || new Date();
        this.fecha_actualizacion = data.fecha_actualizacion || new Date();
        this.razon = data.razon || null;
        this.frecuencia = data.frecuencia || null;
        this.tipo_frecuencia = data.tipo_frecuencia || null;
    }

    static validate(data) {
        const errors = [];
        
        if (!data.id_persona) {
            errors.push('El ID de persona es requerido');
        }
        
        if (!data.monto_mensual || data.monto_mensual <= 0) {
            errors.push('El monto mensual debe ser mayor a 0');
        }
        
        if (!data.fecha_inicio) {
            errors.push('La fecha de inicio es requerida');
        }
        
        if (data.estado && !['activa', 'cancelada', 'pausada', 'finalizada'].includes(data.estado)) {
            errors.push('El estado debe ser activa, cancelada, pausada o finalizada');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id: this.id,
            id_persona: this.id_persona,
            mp_subscription_id: this.mp_subscription_id,
            mp_preapproval_id: this.mp_preapproval_id,
            estado: this.estado,
            tipo_plan: this.tipo_plan,
            monto_mensual: this.monto_mensual,
            fecha_inicio: this.fecha_inicio,
            fecha_fin: this.fecha_fin,
            activa: this.activa,
            external_reference: this.external_reference,
            fecha_creacion: this.fecha_creacion,
            fecha_actualizacion: this.fecha_actualizacion,
            razon: this.razon,
            frecuencia: this.frecuencia,
            tipo_frecuencia: this.tipo_frecuencia
        };
    }
}

module.exports = SuscripcionesMp;
