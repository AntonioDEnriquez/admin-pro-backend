const { response } = require('express');
const fs = require('fs');

//  Sirve para poder construir un path completo
const path = require('path');

// Paquete de uuid para generar identificadores unicos
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = (req, res = response) => {

    const { tipo, id } = req.params;

    // Validar tipo
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un medico, usuarios u hospital'
        });
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo.'
        });
    }

    // Procesar la imagen...
    // El nombre imagen es el que colocamos en postman
    // Para acceder a la data de la imagen
    const file = req.files.imagen;

    /* Lo cortamos por el punto por que puede que tenga el nombre wolverine.1.3.jpg y lo unico que interesa es la ultima parte el .jpg, 
    entonces al seprarlo ahora tenemos un arreglo con cada una de los valores en una posicion del arreglo */
    const nombreCortado = file.name.split('.');
    // Si quieremos la extension va a ser igual al nombreCortado en la ultima posicion
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg,', 'gif', 'webp', 'JPEG'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extension permitida'
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    // Path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover la imagen
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        // Actualizar base de datos
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        })
    });



}

const retornaImagen = (req, res = response) => {
    const { tipo, foto } = req.params;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    // Imagen por defecto
    if (fs.existsSync(pathImg)) {
        // Para traer el archivo
        res.sendFile(pathImg);
    } else {
        // no importa que las variables sean iguales por que son variables de scope o bloque
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg)
    }



}

module.exports = {
    fileUpload,
    retornaImagen
}