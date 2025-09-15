class FormaPago {
    constructor(data = {}) {
        this.id_forma_pago = data.id_forma_pago || null;
        this.nombre = data.nombre || null;
    }

    static validate(data) {
        const errors = [];
        
        if (!data.nombre) {
            errors.push('El nombre de la forma de pago es requerido');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id_forma_pago: this.id_forma_pago,
            nombre: this.nombre
        };
    }
}

module.exports = FormaPago;
