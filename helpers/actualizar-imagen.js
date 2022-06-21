const fs = require('fs');

const Usuario = require('../models/usuario');
const Hospitales = require('../models/hospital');
const Medicos = require('../models/medicos');


const borrarImagen = (path) => {

    if (fs.existsSync(path)) {
        // borra la imagen anterior
        fs.unlinkSync(path);
    }
}

const actualizarImagen = async (tipo, id, nombreArchivo) => {
    let pathViejo = '';
    switch (tipo) {
        case 'medicos':
            const medico = await Medicos.findById(id);

            if (!medico) {
                console.log('No es un médico por id');
                return false;
            }

            pathViejo = `./uploads/medicos/${medico.img}`;
            borrarImagen(pathViejo);

            medico.img = nombreArchivo;
            await medico.save();
            return true;

            break;

        case 'hospitales':
            const hospital = await Hospitales.findById(id);

            if (!hospital) {
                console.log('No es un hospital por id');
                return false;
            }

            pathViejo = `./uploads/hospitales/${hospital.img}`;
            borrarImagen(pathViejo);

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
            break;

        case 'usuarios':
            const usuario = await Usuario.findById(id);

            if (!usuario) {
                console.log('No es un usuario por id');
                return false;
            }

            pathViejo = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pathViejo);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
            break;


    }


}


module.exports = {
    actualizarImagen
}