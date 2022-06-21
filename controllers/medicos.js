const { response } = require("express");
const Medico = require('../models/medicos');


const getMedicos = async (req, res = response) => {
    const medicos = await Medico.find().populate('usuario', 'nombre img').populate('hospital', 'nombre img');

    res.json({
        ok: true,
        medicos
    });

}
const crearMedicos = async (req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {
        const medicosDB = await medico.save();
        res.json({
            ok: true,
            medico: medicosDB
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const actualizarMedicos = (req, res = response) => {


    res.json({
        ok: true,
        msg: 'Actualizar Medicos'
    });
}

const borrarMedicos = (req, res = response) => {


    res.json({
        ok: true,
        msg: 'Borrar Medicos'
    });
}

module.exports = {
    getMedicos,
    crearMedicos,
    actualizarMedicos,
    borrarMedicos
}