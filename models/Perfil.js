class Perfil {
    constructor(data = {}) {
        this.id_perfil = data.id_perfil || null;
        this.nombre_perfil = data.nombre_perfil || null;
        this.estado = data.estado || true;
    }

    static validate(data) {
        const errors = [];

        if (!data.nombre_perfil) {
            errors.push('El nombre del perfil es requerido');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id_perfil: this.id_perfil,
            nombre_perfil: this.nombre_perfil,
            estado: this.estado
        };
    }
}

module.exports = Perfil;
