class Ejercicio {
    constructor(data = {}) {
        this.id_ejercicio = data.id_ejercicio || null;
        this.id_grupo_muscular = data.id_grupo_muscular || null;
        this.nombre = data.nombre || null;
        this.img_1 = data.img_1 || null;
        this.img_2 = data.img_2 || null;
        this.img_3 = data.img_3 || null;
        this.descripcion = data.descripcion || null;
        this.link_video = data.link_video || null;
    }

    static validate(data) {
        const errors = [];

        if (!data.id_grupo_muscular) {
            errors.push('El ID del grupo muscular es requerido');
        }

        if (!data.nombre) {
            errors.push('El nombre del ejercicio es requerido');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id_ejercicio: this.id_ejercicio,
            id_grupo_muscular: this.id_grupo_muscular,
            nombre: this.nombre,
            img_1: this.img_1,
            img_2: this.img_2,
            img_3: this.img_3,
            descripcion: this.descripcion,
            link_video: this.link_video
        };
    }
}

module.exports = Ejercicio;
