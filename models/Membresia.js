class Membresia {
    constructor(data = {}) {
        this.id_membresia = data.id_membresia || null;
        this.id_gimnasio = data.id_gimnasio || null;
        this.nombre = data.nombre || null;
        this.descripcion = data.descripcion || null;
        this.precio = data.precio || null;
        this.duracion = data.duracion || null;
        this.tipo = data.tipo || null;
        this.fecha_creacion = data.fecha_creacion || new Date();
        this.estado = data.estado || 'activo';
    }

    static validate(data) {
        const errors = [];
        
        if (!data.id_gimnasio) {
            errors.push('El ID del gimnasio es requerido');
        }
        
        if (!data.nombre) {
            errors.push('El nombre de la membresía es requerido');
        }
        
        if (!data.precio || data.precio <= 0) {
            errors.push('El precio debe ser mayor a 0');
        }
        
        if (!data.duracion || data.duracion <= 0) {
            errors.push('La duración debe ser mayor a 0');
        }
        
        if (!data.tipo || !['mensual','anual','semanal','trimestral'].includes(data.tipo)) {
            errors.push('El tipo debe ser mensual, anual, semanal o trimestral');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id_membresia: this.id_membresia,
            id_gimnasio: this.id_gimnasio,
            nombre: this.nombre,
            descripcion: this.descripcion,
            precio: this.precio,
            duracion: this.duracion,
            tipo: this.tipo,
            fecha_creacion: this.fecha_creacion,
            estado: this.estado
        };
    }
}

module.exports = Membresia;
