const bcrypt = require('bcryptjs');
const { response } = require('express');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/usuario');

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

module.exports = { login }