class Persona {
    constructor(data = {}) {
        this.id_persona = data.id_persona || null;
        this.dni = data.dni || null;
        this.id_acceso = data.id_acceso || null;
        this.nombre = data.nombre || null;
        this.apellido = data.apellido || null;
        this.fecha_nacimiento = data.fecha_nacimiento || null;
        this.fecha_registro = data.fecha_registro || new Date();
        this.celular = data.celular || null;
        this.direccion = data.direccion || null;
        this.email = data.email || null;
        this.password = data.password || null;
        this.foto_archivo = data.foto_archivo || null;
        this.ultimo_pago = data.ultimo_pago || new Date();
        this.activo = data.activo || 1;
        this.tiene_suscripcion_activa = data.tiene_suscripcion_activa || false;
        this.fecha_ultima_suscripcion = data.fecha_ultima_suscripcion || null;
    }

    static validate(data) {
        const errors = [];
        
        if (!data.dni) {
            errors.push('El DNI es requerido');
        }
        
        if (!data.nombre) {
            errors.push('El nombre es requerido');
        }
        
        if (!data.apellido) {
            errors.push('El apellido es requerido');
        }
        
        if (!data.email) {
            errors.push('El email es requerido');
        } else if (!this.validateEmail(data.email)) {
            errors.push('El email no tiene un formato válido');
        }
        
        if (!data.password) {
            errors.push('La contraseña es requerida');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    toJSON() {
        const { password, ...personaWithoutPassword } = this;
        return personaWithoutPassword;
    }

    getFullName() {
        return `${this.nombre} ${this.apellido}`;
    }
}

module.exports = Persona;
