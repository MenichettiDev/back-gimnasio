class Logros {
    constructor(data = {}) {
        this.id_logro = data.id_logro || null;
        this.id_atleta = data.id_atleta || null;
        this.nombre_logro = data.nombre_logro || null;
        this.descripcion_logro = data.descripcion_logro || null;
        this.fecha = data.fecha || new Date();
    }

    static validate(data) {
        const errors = [];
        
        if (!data.id_atleta) {
            errors.push('El ID del atleta es requerido');
        }
        
        if (!data.nombre_logro) {
            errors.push('El nombre del logro es requerido');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id_logro: this.id_logro,
            id_atleta: this.id_atleta,
            nombre_logro: this.nombre_logro,
            descripcion_logro: this.descripcion_logro,
            fecha: this.fecha
        };
    }
}

module.exports = Logros;
