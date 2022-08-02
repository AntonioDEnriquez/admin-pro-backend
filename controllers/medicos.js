const { response } = require("express");
const Medico = require('../models/medicos');


const getMedicos = async (req, res = response) => {
    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img')


    res.json({
        ok: true,
        medicos
    });
}
const getMedicoById = async (req, res = response) => {
    const id = req.params.id;
    try {

        const medico = await Medico.findById(id)
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img');


        res.json({
            ok: true,
            medico
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Medico no encontrado'
        })
    }
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

const actualizarMedicos = async (req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;


    try {

        const medicos = await Medico.findById(id);

        if (!medicos) {
            res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por Id'
            });
        }

        const cambiosMedicos = {
            ...req.body,
            usuario: uid
        }

        // {new: true} para que regrese el ultimo documento actualizado
        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedicos, { new: true });

        res.json({
            ok: true,
            hospital: medicoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const borrarMedicos = async (req, res = response) => {


    const id = req.params.id;

    try {

        const medicos = await Medico.findById(id);

        if (!medicos) {
            res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por Id'
            });
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Medico eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    getMedicos,
    getMedicoById,
    crearMedicos,
    actualizarMedicos,
    borrarMedicos
}