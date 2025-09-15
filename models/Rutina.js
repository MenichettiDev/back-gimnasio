class Rutina {
    constructor(data = {}) {
        this.id_rutina = data.id_rutina || null;
        this.id_creador = data.id_creador || null;
        this.nombre = data.nombre || null;
        this.cantidad_dias = data.cantidad_dias || null;
        this.nivel_atleta = data.nivel_atleta || null;
        this.objetivo = data.objetivo || null;
        this.descripcion = data.descripcion || null;
    }

    static validate(data) {
        const errors = [];
        
        if (!data.id_creador) {
            errors.push('El ID del creador es requerido');
        }
        
        if (!data.nombre) {
            errors.push('El nombre de la rutina es requerido');
        }
        
        if (!data.cantidad_dias || !['1','2','3','4','5','6','7'].includes(data.cantidad_dias)) {
            errors.push('La cantidad de días debe ser entre 1 y 7');
        }
        
        if (!data.nivel_atleta || !['Principiante','Intermedio','Avanzado'].includes(data.nivel_atleta)) {
            errors.push('El nivel del atleta debe ser Principiante, Intermedio o Avanzado');
        }
        
        if (!data.objetivo || !['Musculacion','Tonificacion','Resistencia','Peso'].includes(data.objetivo)) {
            errors.push('El objetivo debe ser Musculacion, Tonificacion, Resistencia o Peso');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id_rutina: this.id_rutina,
            id_creador: this.id_creador,
            nombre: this.nombre,
            cantidad_dias: this.cantidad_dias,
            nivel_atleta: this.nivel_atleta,
            objetivo: this.objetivo,
            descripcion: this.descripcion
        };
    }
}

module.exports = Rutina;
