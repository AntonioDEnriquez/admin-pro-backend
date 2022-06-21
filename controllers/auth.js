const bcrypt = require('bcryptjs');
const { response } = require('express');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/usuario');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar email

        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe!!'
            });
        }

        // Verificar contraseña
        // Compara la contraseña que estoy ingresando con la que esta en la base de datos para verificar si hacen match
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe!'
            });
        }

        // Generar el TOKEN - JWT
        // Como ya regresa una promesa podemos esperar a que genere el token con await
        const token = await generarJWT(usuarioDB.id);

        // Una vez generado el token retornamos la respuesta
        res.json({
            ok: true,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

// Login Google
const googleSignIn = async (req, res = response) => {

    try {
        const { email, name, picture } = await googleVerify(req.body.token);

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                // El password solo lo ponemos para que no choque con la validacion
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar usuario
        await usuario.save();

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            email, name, picture, token
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Token de google no es correcto'
        });
    }

}

module.exports = { login, googleSignIn }