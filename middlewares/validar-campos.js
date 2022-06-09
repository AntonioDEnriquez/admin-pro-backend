// Importaciones
// Para obtener el tipado de la response
const { response } = require('express');

// Exportamos de express validator el paquete validationResult, es decir el resultado de la validacion
const { validationResult } = require('express-validator');

// Funcion adicional next, este se mandara a llamar si este middleware pasa, es decir, continue con el siguiente paso
// Este validar campos se uitilizara en la ruta donde lo necesitemos
const validarCampos = (req, res = response, next) => {
    // Una vez que haya pasado por mi middleware, si hubo errores aqui los cachamos

    /* Al pasar por el middleware del check que esta en routes va a crear en la req un arreglo de errores con todo
    lo que no sucedio, osea con todos los errores que pasaron en mi ruta */
    const errores = validationResult(req);

    // Si no esta vacio significa que hay errores
    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }
    // Si llega a este punto significa que no hay errores, entonces llamamos al next
    next();
}

// Exportamos para que sea visible para otros componentes
module.exports = { validarCampos }