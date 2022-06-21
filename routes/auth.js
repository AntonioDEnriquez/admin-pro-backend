/*
    Ruta: /api/login
*/

// importaciones
// Para configurar mis rutas
const { Router } = require('express');
const { check } = require('express-validator');

// importamos el controlador
const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

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
)




module.exports = router;