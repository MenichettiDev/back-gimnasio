class GrupoMuscular {
    constructor(data = {}) {
        this.id_grupo_muscular = data.id_grupo_muscular || null;
        this.nombre = data.nombre || null;
    }

    static validate(data) {
        const errors = [];

        if (!data.nombre) {
            errors.push('El nombre del grupo muscular es requerido');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id_grupo_muscular: this.id_grupo_muscular,
            nombre: this.nombre
        };
    }
}

module.exports = GrupoMuscular;
