const { Schema, model } = require('mongoose');

// Definicion de cada uno de los registros que estaran dentro de la coleccion "tabla" de usuarios
const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    },
});

UsuarioSchema.method('toJSON', function () {
    // Basicamente convirtio el _uid que viene de mongo a uid
    // Extraemos el password del objeto para que no se muestre en las respuestas
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model('Usuario', UsuarioSchema);