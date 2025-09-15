class Metas {
    constructor(data = {}) {
        this.id_meta = data.id_meta || null;
        this.id_atleta = data.id_atleta || null;
        this.descripcion = data.descripcion || null;
        this.tipo_meta = data.tipo_meta || null;
        this.valor_objetivo = data.valor_objetivo || null;
        this.fecha_establecimiento = data.fecha_establecimiento || null;
        this.fecha_vencimiento = data.fecha_vencimiento || null;
        this.estado = data.estado || null;
    }

    static validate(data) {
        const errors = [];
        
        if (!data.id_atleta) {
            errors.push('El ID del atleta es requerido');
        }
        
        if (!data.descripcion) {
            errors.push('La descripción de la meta es requerida');
        }
        
        if (!data.tipo_meta) {
            errors.push('El tipo de meta es requerido');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id_meta: this.id_meta,
            id_atleta: this.id_atleta,
            descripcion: this.descripcion,
            tipo_meta: this.tipo_meta,
            valor_objetivo: this.valor_objetivo,
            fecha_establecimiento: this.fecha_establecimiento,
            fecha_vencimiento: this.fecha_vencimiento,
            estado: this.estado
        };
    }
}

module.exports = Metas;
