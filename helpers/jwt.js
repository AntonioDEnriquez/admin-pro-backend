const jwt = require('jsonwebtoken');


const generarJWT = (uid) => {

    // transformamos a promesa para poder utilizarlo dentro de un metodo async
    return new Promise((resolve, reject) => {
        // Informacion no sensible que estara en el token
        const payload = {
            uid
        };

        // Crear token
        // necesita el payload que es la informacion, la clave secreta y la duracion
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });
    });
}

module.exports = {
    generarJWT
}