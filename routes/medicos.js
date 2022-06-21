/*
    Medicos
    ruta: /api/medicos
*/

// Para configurar mis rutas
const { Router } = require('express');
// Importamos de expres validator el paquere check
const { check } = require('express-validator');
const { getMedicos, crearMedicos, actualizarMedicos, borrarMedicos } = require('../controllers/medicos');

const router = Router();

// Importamos nuestro middleware validar campos
const { validarCampos } = require('../middlewares/validar-campos');

// Validamos el token 
const { validarJWT } = require('../middlewares/validar-jwt');

// Retorna los Medicos
router.get('/', getMedicos);

// Crea Medicos
/* Para implementar un unico middleware nosotros lo mandaremos como segundo argumento y el tercero ya seria el controlador,
 Si queremos mandar varios middlewares tiene que ser entre [] */
router.post('/',
    // Arreglo de middlewares
    // Es un middleware por cada campo que queramos validar
    // Podemos agregar los mensajes personalizados como un segundo argumento al check
    [
        validarJWT,
        check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
        check('hospital', 'El hospital id debe de ser valido').isMongoId(),
        validarCampos

    ],
    crearMedicos
);

// Actualizar Medicos
router.put('/:id',
    [


    ],
    actualizarMedicos
);

// Eliminar Medicos
router.delete('/:id',
    borrarMedicos
);




module.exports = router;
