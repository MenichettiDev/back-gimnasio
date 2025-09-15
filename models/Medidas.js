class Medidas {
    constructor(data = {}) {
        this.id_medida = data.id_medida || null;
        this.id_atleta = data.id_atleta || null;
        this.fecha_medicion = data.fecha_medicion || null;
        this.peso = data.peso || null;
        this.altura = data.altura || null;
        this.biceps = data.biceps || null;
        this.pecho = data.pecho || null;
        this.hombros = data.hombros || null;
        this.cintura = data.cintura || null;
        this.gluteos = data.gluteos || null;
        this.cuadriceps = data.cuadriceps || null;
        this.gemelos = data.gemelos || null;
        this.antebrazo = data.antebrazo || null;
        this.cuello = data.cuello || null;
        this.grasa_corporal = data.grasa_corporal || null;
    }

    static validate(data) {
        const errors = [];
        
        if (!data.id_atleta) {
            errors.push('El ID del atleta es requerido');
        }
        
        if (!data.fecha_medicion) {
            errors.push('La fecha de medición es requerida');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id_medida: this.id_medida,
            id_atleta: this.id_atleta,
            fecha_medicion: this.fecha_medicion,
            peso: this.peso,
            altura: this.altura,
            biceps: this.biceps,
            pecho: this.pecho,
            hombros: this.hombros,
            cintura: this.cintura,
            gluteos: this.gluteos,
            cuadriceps: this.cuadriceps,
            gemelos: this.gemelos,
            antebrazo: this.antebrazo,
            cuello: this.cuello,
            grasa_corporal: this.grasa_corporal
        };
    }
}

module.exports = Medidas;
