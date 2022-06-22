/*
    Hospitales
    ruta: /api/hospitales
*/

// Para configurar mis rutas
const { Router } = require('express');
// Importamos de expres validator el paquere check
const { check } = require('express-validator');
const { getHospitales, crearHospital, actualizarHospital, borrarHospital } = require('../controllers/hospitales');
const router = Router();

// Importamos nuestro middleware validar campos
const { validarCampos } = require('../middlewares/validar-campos');

// Validamos el token 
const { validarJWT } = require('../middlewares/validar-jwt');

// Retorna los hospitales
router.get('/', getHospitales);

// Crea hospitales
/* Para implementar un unico middleware nosotros lo mandaremos como segundo argumento y el tercero ya seria el controlador,
 Si queremos mandar varios middlewares tiene que ser entre [] */
router.post('/',
    // Arreglo de middlewares
    // Es un middleware por cada campo que queramos validar
    // Podemos agregar los mensajes personalizados como un segundo argumento al check
    [
        validarJWT,
        check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
        validarCampos

    ],
    crearHospital
);

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),

    ],
    actualizarHospital
);

router.delete('/:id',
    validarJWT,
    borrarHospital
);




module.exports = router;
