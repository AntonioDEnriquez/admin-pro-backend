// getTodo

const { response } = require("express");
const Usuario = require('../models/usuario');
const Hospitales = require('../models/hospital');
const Medicos = require('../models/medicos');


const getTodo = async (req, res = response) => {

    const busqueda = req.params.busqueda;


    // Convertimos el parametro a una expesion regular y le decimos que sea insensitive para poder buscar cualquier coincidencia
    const regex = new RegExp(busqueda, 'i');

    // Buscar por nombre
    // const usuarios = await Usuario.find({ nombre: regex });
    // const hospitales = await Hospitales.find({ nombre: regex });
    // const medicos = await Medicos.find({ nombre: regex });

    const [usuarios, hospitales, medicos] = await Promise.all([
        // Buscar por nombre
        Usuario.find({ nombre: regex }),
        Hospitales.find({ nombre: regex }),
        Medicos.find({ nombre: regex })
    ]);


    res.json({
        ok: true,
        usuarios,
        hospitales,
        medicos
    });
}

const getDocumentosCollecion = async (req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    console.log(busqueda);

    // Convertimos el parametro a una expesion regular y le decimos que sea insensitive para poder buscar cualquier coincidencia
    const regex = new RegExp(busqueda, 'i');

    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medicos.find({ nombre: regex }).populate('nombre', 'nombre img').populate('hospital', 'nombre img')
            break;

        case 'hospitales':
            data = await Hospitales.find({ nombre: regex }).populate('nombre', 'nombre img');


            break;
        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
            });
    }

    res.json({
        ok: true,
        msg: '',
        resultados: data
    });
}

module.exports = {
    getTodo,
    getDocumentosCollecion
}