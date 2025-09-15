class Entrenador {
    constructor(data = {}) {
        this.id_entrenador = data.id_entrenador || null;
        this.id_persona = data.id_persona || null;
        this.fecha_ingreso = data.fecha_ingreso || null;
        this.estado = data.estado || 'activo';
    }

    static validate(data) {
        const errors = [];

        if (!data.id_persona) {
            errors.push('El ID de persona es requerido');
        }

        if (!data.fecha_ingreso) {
            errors.push('La fecha de ingreso es requerida');
        }

        if (data.estado && !['activo', 'inactivo'].includes(data.estado)) {
            errors.push('El estado debe ser activo o inactivo');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id_entrenador: this.id_entrenador,
            id_persona: this.id_persona,
            fecha_ingreso: this.fecha_ingreso,
            estado: this.estado
        };
    }
}

module.exports = Entrenador;
