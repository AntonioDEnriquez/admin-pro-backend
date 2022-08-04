const { response } = require("express");
const jwt = require("jsonwebtoken");
const usuario = require('../models/usuario');


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

// El next es lo diferente del midleware a un controlador normal
const validarADMIN_ROLE = async (req, res = response, next) => {

    const uid = req.uid;

    try {

        const usuarioDB = await usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe!!'
            });
        }

        if (usuarioDB.role !== 'ADMIN_ROLE') {
            // 403 = unauthorized
            return res.status(403).json({
                ok: false,
                msg: 'Usuario no tiene privilegios para hacer eso'
            });
        }

        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}
const validarADMIN_ROLE_o_MismoUsuario = async (req, res = response, next) => {

    const uid = req.uid;
    const id = req.params.id;

    try {

        const usuarioDB = await usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe!!'
            });
        }

        // Validamos que el usuario sea admin o que el id sea la misma que quiere actualizar

        return (usuarioDB.role === 'ADMIN_ROLE' || uid === id) ? next() : res.status(403).json({ ok: false, msg: 'Usuario no tiene privilegios para hacer eso' })

        // if (usuarioDB.role === 'ADMIN_ROLE' || uid === id) {
        //     next();
        // } else {
        //     // 403 = unauthorized
        //     return res.status(403).json({
        //         ok: false,
        //         msg: 'Usuario no tiene privilegios para hacer eso'
        //     });
        // }


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_MismoUsuario
}