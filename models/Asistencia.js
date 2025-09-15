class Asistencia {
    constructor(data = {}) {
        this.id_asistencia = data.id_asistencia || null;
        this.id_atleta = data.id_atleta || null;
        this.fecha = data.fecha || null;
        this.asistio = data.asistio || false;
    }

    static validate(data) {
        const errors = [];
        
        if (!data.id_atleta) {
            errors.push('El ID del atleta es requerido');
        }
        
        if (!data.fecha) {
            errors.push('La fecha es requerida');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id_asistencia: this.id_asistencia,
            id_atleta: this.id_atleta,
            fecha: this.fecha,
            asistio: this.asistio
        };
    }
}

module.exports = Asistencia;
