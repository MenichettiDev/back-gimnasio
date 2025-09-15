class Pago {
    constructor(data = {}) {
        this.id_pago = data.id_pago || null;
        this.id_persona = data.id_persona || null;
        this.fecha_pago = data.fecha_pago || new Date();
        this.monto = data.monto || null;
        this.concepto = data.concepto || null;
        this.id_forma_pago = data.id_forma_pago || null;
        this.mp_payment_id = data.mp_payment_id || null;
        this.mp_status = data.mp_status || null;
        this.mp_subscription_id = data.mp_subscription_id || null;
    }

    static validate(data) {
        const errors = [];
        
        if (!data.id_persona) {
            errors.push('El ID de persona es requerido');
        }
        
        if (!data.monto || data.monto <= 0) {
            errors.push('El monto debe ser mayor a 0');
        }
        
        if (!data.concepto) {
            errors.push('El concepto del pago es requerido');
        }
        
        if (!data.id_forma_pago) {
            errors.push('La forma de pago es requerida');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id_pago: this.id_pago,
            id_persona: this.id_persona,
            fecha_pago: this.fecha_pago,
            monto: this.monto,
            concepto: this.concepto,
            id_forma_pago: this.id_forma_pago,
            mp_payment_id: this.mp_payment_id,
            mp_status: this.mp_status,
            mp_subscription_id: this.mp_subscription_id
        };
    }
}

module.exports = Pago;
