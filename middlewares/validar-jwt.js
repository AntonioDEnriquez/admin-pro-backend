const { response } = require("express");
const jwt = require("jsonwebtoken");



const validarJWT = (req, res = response, next) => {

    // Leer el token
    // El token lo vamos a leer de los headers
    const token = req.header('x-token');

    // Si no hay token retorna error
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }

    try {

        // Esto va intentar usar la clave secreta y comporbar si hace el match con la firma que tiene el token
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        // Establecemos que la req va a tener un nuevo elemento llamado uid y este sera igual al uid que lei del token
        req.uid = uid;
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }

}

module.exports = { validarJWT }