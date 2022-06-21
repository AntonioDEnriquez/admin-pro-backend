const { Schema, model } = require('mongoose');

// Definicion de cada uno de los registros que estaran dentro de la coleccion "tabla" de usuarios
const HospitalSchema = Schema({
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
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
},
    // Cambiamos el nombre de la collecion
    {
        collection: 'hospitales'
    }
);

HospitalSchema.method('toJSON', function () {
    // Extraemos el password del objeto para que no se muestre en las respuestas
    const { __v, password, ...object } = this.toObject();

    return object;
});

module.exports = model('Hospital', HospitalSchema);