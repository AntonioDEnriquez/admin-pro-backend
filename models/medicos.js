const { Schema, model } = require('mongoose');

// Definicion de cada uno de los registros que estaran dentro de la coleccion "tabla" de usuarios
const MedicosSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    usuario: {
        /* Esto le va indicar a mongoose que va haber una relacion entre este documento o este Schema con 
         las siguiente referencia */
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true

    },
    hospital: {
        /* Esto le va indicar a mongoose que va haber una relacion entre este documento o este Schema con 
         las siguiente referencia */
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    }
});

MedicosSchema.method('toJSON', function () {
    // Extraemos el password del objeto para que no se muestre en las respuestas
    const { __v, ...object } = this.toObject();

    return object;
});

module.exports = model('Medicos', MedicosSchema);