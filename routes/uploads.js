/* 

ruta: api/uploads/:

*/
const { Router } = require('express');
const { fileUpload, retornaImagen } = require('../controllers/uploads');
const { validarJWT } = require("../middlewares/validar-jwt");
// Paquete de express para subir archivos
const expressFileUpload = require('express-fileupload');


const router = Router();

router.use(expressFileUpload());

router.put('/:tipo/:id', validarJWT, fileUpload);

router.get('/:tipo/:foto', retornaImagen);

module.exports = router;
