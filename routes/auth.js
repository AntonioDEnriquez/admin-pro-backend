/*
    Ruta: /api/login
*/

// importaciones
// Para configurar mis rutas
const { Router } = require('express');
const { check } = require('express-validator');

// importamos el controlador
const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require("../middlewares/validar-jwt");

// Creamos la instancia de router
const router = Router();


// Login
router.post('/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ],
    login
);

// Login Google
router.post('/google',
    [
        check('token', 'El Token de google es obligatorio').not().isEmpty(),
        validarCampos
    ],
    googleSignIn
);


router.get('/renew',
    validarJWT,
    renewToken
);




module.exports = router;