class Gimnasio {
    constructor(data = {}) {
        this.id_gimnasio = data.id_gimnasio || null;
        this.id_persona = data.id_persona || null;
        this.nombre = data.nombre || null;
        this.direccion = data.direccion || null;
        this.telefono = data.telefono || null;
        this.horario_apertura = data.horario_apertura || null;
        this.horario_cierre = data.horario_cierre || null;
        this.estado = data.estado || 'activo';
        this.descripcion = data.descripcion || null;
        this.fecha_registro = data.fecha_registro || new Date();
        this.pagina_web = data.pagina_web || null;
        this.foto = data.foto || null;
        this.ultimo_pago = data.ultimo_pago || null;
    }

    static validate(data) {
        const errors = [];
        
        if (!data.id_persona) {
            errors.push('El ID de persona es requerido');
        }
        
        if (!data.nombre) {
            errors.push('El nombre del gimnasio es requerido');
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
            id_gimnasio: this.id_gimnasio,
            id_persona: this.id_persona,
            nombre: this.nombre,
            direccion: this.direccion,
            telefono: this.telefono,
            horario_apertura: this.horario_apertura,
            horario_cierre: this.horario_cierre,
            estado: this.estado,
            descripcion: this.descripcion,
            fecha_registro: this.fecha_registro,
            pagina_web: this.pagina_web,
            foto: this.foto,
            ultimo_pago: this.ultimo_pago
        };
    }
}

module.exports = Gimnasio;
