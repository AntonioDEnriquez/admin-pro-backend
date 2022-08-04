/*
    Ruta: /api/usuarios
*/

// Para configurar mis rutas
const { Router } = require('express');
// Importamos de expres validator el paquere check
const { check } = require('express-validator');

const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');

const router = Router();

// Importamos nuestro middleware validar campos
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarADMIN_ROLE, validarADMIN_ROLE_o_MismoUsuario } = require('../middlewares/validar-jwt');


// Solo mandamos la referencia a la funcion, no ejecutamos, osea no le ponemos parentesis
/* Middlewares: Son funciones que se ejecutan antes de llegar a otras, tambien verifican que la informacion venga como nosotros esperamos */

// Retorna los usuarios
router.get('/', validarJWT, getUsuarios);

// Crea usuarios
/* Para implementar un unico middleware nosotros lo mandaremos como segundo argumento y el tercero ya seria el controlador,
 Si queremos mandar varios middlewares tiene que ser entre [] */
router.post('/',
    // Arreglo de middlewares
    // Es un middleware por cada campo que queramos validar
    // Podemos agregar los mensajes personalizados como un segundo argumento al check
    [
        // Verifica que nombre no este vacio
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        // Verifica que password no este vacio
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        // Verifica que email sea un Email
        check('email', 'El email es obligatorio').isEmail(),
        // Este validar campos debe de ser el ultimo que debemos mandar a llamar despues de los checks
        validarCampos,
    ],
    crearUsuario
);

router.put('/:id',
    [
        validarJWT,
        // Validacion de role
        validarADMIN_ROLE_o_MismoUsuario,
        // Verifica que nombre no este vacio
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        // Verifica que email sea un Email
        check('email', 'El email es obligatorio').isEmail(),
        // Verifica que role no este vacio
        check('role', 'El role es obligatorio').not().isEmpty(),
        validarCampos,

    ],
    actualizarUsuario
);

router.delete('/:id',
    [
        validarJWT,
        validarADMIN_ROLE,
    ],
    borrarUsuario
);




module.exports = router;
