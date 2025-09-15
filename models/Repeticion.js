class Repeticion {
    constructor(data = {}) {
        this.id_repeticion = data.id_repeticion || null;
        this.nombre = data.nombre || null;
        this.frecuencia = data.frecuencia || null;
        this.comentario = data.comentario || null;
    }

    static validate(data) {
        const errors = [];
        
        if (!data.nombre) {
            errors.push('El nombre de la repetición es requerido');
        }
        
        if (!data.frecuencia) {
            errors.push('La frecuencia es requerida');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id_repeticion: this.id_repeticion,
            nombre: this.nombre,
            frecuencia: this.frecuencia,
            comentario: this.comentario
        };
    }
}

module.exports = Repeticion;
