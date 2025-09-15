class Atleta {
    constructor(data = {}) {
        this.id_atleta = data.id_atleta || null;
        this.id_persona = data.id_persona || null;
        this.id_entrenador = data.id_entrenador || null;
        this.id_gimnasio = data.id_gimnasio || null;
        this.estado = data.estado || 'activo';
        this.fecha_registro = data.fecha_registro || new Date();
        this.ultimo_pago = data.ultimo_pago || null;
    }

    static validate(data) {
        const errors = [];
        
        if (!data.id_persona) {
            errors.push('El ID de persona es requerido');
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
            id_atleta: this.id_atleta,
            id_persona: this.id_persona,
            id_entrenador: this.id_entrenador,
            id_gimnasio: this.id_gimnasio,
            estado: this.estado,
            fecha_registro: this.fecha_registro,
            ultimo_pago: this.ultimo_pago
        };
    }
}

module.exports = Atleta;
