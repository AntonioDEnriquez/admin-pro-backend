// Funciones que yo voy a exportar, la logica que va a hacer cada una de mis rutas

// Importaciones
// Para tener las ayudas de typeScript
// Me puede servir para poner el tipado
const { response } = require('express');

const Usuario = require('../models/usuario');

// Importamos el paquete de bcryptjs, el nombre es el que nosotros queramos darle
const bcrypt = require('bcryptjs');
const res = require('express/lib/response');
const { generarJWT } = require('../helpers/jwt');

// Funcion
const getUsuarios = async (req, res) => {
    // Traer Usuarios
    const usuarios = await Usuario.find({}, 'nombre email role google');



    // resp.status para poner un codigo
    res.json({
        ok: true,
        usuarios,
        // uid: req.uid
    });
}
/* res = response, si no viene la respuesta en el metodo, voy a poner el valor por defecto de response, 
en teoria res nunca va a venir vacio pero VsCode sabe de que por lo menos debe de ser response */
const crearUsuario = async (req, res = response) => {
    // resp.status para poner un codigo

    // Leer el body
    const { email, password, nombre } = req.body;

    // Como puede que algo suceda mal, haya error ponemos dentro de un trycath
    try {

        // Validar que el correo sea unico
        // el objeto era email: email pero como son iguales puedo dejar solo email
        // Esto es una promesa entonces el metodo debe de ser async y debemos esperar una respuesta, para ello agregamos el await
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Este correo ya existe'
            });
        }

        // Crear instancia de mi usuario
        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        /* Primero tenemos que generar un salt que es un numero o data generada de manera aleatoria de tal manera que nos ayude a encriptarla y 
         y que nosotros ni siquiera sepamos que proceso o que procedimiento usamos para encriptarlo */
        // Para esto utilizamos bcrypt.genSaltSync() para que no tengamos que poner el await o llamar callbacks
        const salt = bcrypt.genSaltSync();
        // El password que le pasamos al hashSync es el que recibimos del body
        usuario.password = bcrypt.hashSync(password, salt);

        // Grabar en la base de datos
        await usuario.save();

        // Una vez creado el usuario generamos el Json Web Token
        const token = await generarJWT(usuario.id);

        /* Este res.json solo se puede llamar una sola vez, es decir, 
        si lo tuvieramos duplicado dara un error diciendo que ya se mandaron los headers */
        res.json({
            ok: true,
            usuario,
            msg: 'Usuario registrado con exito',
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })
    }


}

const actualizarUsuario = async (req, res = response) => {
    //TODO: Validar token y comprobar si es el usuario correcto


    const uid = req.params.id;

    try {

        // Busca por el id que le mandamos retornando una promesa
        const usuarioDB = await Usuario.findById(uid);

        // Si no hay usuario retorna error
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ese usuario por ese id'
            });
        }

        // Obtenemos los valores del body
        // Extramoes el password y google por que son valores que no actualizaremos
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email != email) {
            /* Si el email que viene en el body es diferente al que esta en la BD, hacemos la verificacion del email
              */

            // **verificacion del email**
            // Buscamos si existe un correo en otro id igual al que tenemos en el body
            // Era { email: email } pero como esta duplicado queda solo { email } este es el que extraemos de req.body antes
            const existeEmail = await Usuario.findOne({ email: email });
            // Si el correo ya existe no actualiza y muestra el error
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese Email'
                });
            }
        }

        // Ponemos el email que queremos actualizar, en teoria se lo estamos regresando ya que anteriormente se habia extraido
        campos.email = email;

        // Si el usuario existe
        // Actualizaciones

        // Borramos lo que no queremos actualizar en BD
        // Como extraemos los valores antes ya no lo utilizamos asi
        // delete campos.password;
        // delete campos.google;

        // Actualizamos en la base de datos
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}


const borrarUsuario = async (req, res = response) => {
    const uid = req.params.id;

    try {
        // Verificamos que existe el usuario en la BD y lo buscamos por el id
        const usuarioDB = await Usuario.findById(uid);
        // Si el usuario no existe retorna error
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ese usuario por ese id'
            });
        }

        // Si el usuario existe
        // Se elimina con el metodo findByIdAndDelete y le pasamos el id que queremos eliminar
        await Usuario.findByIdAndDelete(uid);

        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}





module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}