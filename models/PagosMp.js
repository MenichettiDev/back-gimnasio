class PagosMp {
    constructor(data = {}) {
        this.id = data.id || null;
        this.id_suscripcion_mp = data.id_suscripcion_mp || null;
        this.id_persona = data.id_persona || null;
        this.mp_payment_id = data.mp_payment_id || null;
        this.monto = data.monto || null;
        this.estado = data.estado || null;
        this.fecha_pago = data.fecha_pago || null;
        this.tipo_pago = data.tipo_pago || 'recurrente';
        this.concepto = data.concepto || null;
        this.mp_status_detail = data.mp_status_detail || null;
        this.mp_payment_method_id = data.mp_payment_method_id || null;
        this.mp_transaction_amount = data.mp_transaction_amount || null;
        this.fecha_creacion = data.fecha_creacion || new Date();
        this.fecha_actualizacion = data.fecha_actualizacion || new Date();
    }

    static validate(data) {
        const errors = [];

        if (!data.id_suscripcion_mp) {
            errors.push('El ID de suscripción MP es requerido');
        }

        if (!data.id_persona) {
            errors.push('El ID de persona es requerido');
        }

        if (!data.mp_payment_id) {
            errors.push('El ID de pago de MercadoPago es requerido');
        }

        if (!data.monto || data.monto <= 0) {
            errors.push('El monto debe ser mayor a 0');
        }

        if (!data.estado) {
            errors.push('El estado es requerido');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id: this.id,
            id_suscripcion_mp: this.id_suscripcion_mp,
            id_persona: this.id_persona,
            mp_payment_id: this.mp_payment_id,
            monto: this.monto,
            estado: this.estado,
            fecha_pago: this.fecha_pago,
            tipo_pago: this.tipo_pago,
            concepto: this.concepto,
            mp_status_detail: this.mp_status_detail,
            mp_payment_method_id: this.mp_payment_method_id,
            mp_transaction_amount: this.mp_transaction_amount,
            fecha_creacion: this.fecha_creacion,
            fecha_actualizacion: this.fecha_actualizacion
        };
    }
}

module.exports = PagosMp;
