class Frases {
    constructor(data = {}) {
        this.id_frase = data.id_frase || null;
        this.frase = data.frase || null;
    }

    static validate(data) {
        const errors = [];
        
        if (!data.frase) {
            errors.push('La frase es requerida');
        }
        
        if (data.frase && data.frase.length > 500) {
            errors.push('La frase no puede exceder los 500 caracteres');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id_frase: this.id_frase,
            frase: this.frase
        };
    }
}

module.exports = Frases;
