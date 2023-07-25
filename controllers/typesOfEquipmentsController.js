const { response } = require('express');
const TypeOfEquipment = require('../models/TypeOfEquipment');

const getTypesOfEquipments = async (req, res = response) => {
    try {
        const typeOfEquipments = await TypeOfEquipment.find();
        res.json({
            ok: true,
            typeOfEquipments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor.',
        });
    }
};

const createTypeOfEquipment = async (req, res = response) => {
    const typeOfEquipment = new TypeOfEquipment(req.body);
    try {
        // Verificar si el tipo de equipo ya existe
        let typeOfEquipmentExists = await TypeOfEquipment.findOne({
            name: typeOfEquipment.name,
        });
        if (typeOfEquipmentExists) {
            return res.status(400).json({
                ok: false,
                msg: 'El tipo de equipamiento ya existe.',
            });
        }

        const typeOfEquipmentDB = await typeOfEquipment.save();

        res.json({
            ok: true,
            msg: 'Tipo de equipamiento creado correctamente.',
            typeOfEquipment: typeOfEquipmentDB,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor.',
        });
    }
};

const updateTypeOfEquipment = async (req, res = response) => {
    const typeOfEquipmentId = req.params.id;

    try {
        // Verificar si el tipo de equipamiento existe
        const typeOfEquipment = await TypeOfEquipment.findById(typeOfEquipmentId);
        if (!typeOfEquipment) {
            return res.status(404).json({
                ok: false,
                msg: 'El tipo de equipamiento no existe.',
            });
        }

        // Verificar si el tipo de equipamiento ya existe
        const { name } = req.body;
        if (name) {
            let typeOfEquipmentExists = await TypeOfEquipment.findOne({
                name,
            });
            if (typeOfEquipmentExists && typeOfEquipmentExists.id !== typeOfEquipmentId) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El tipo de equipamiento ya existe.',
                });
            }
        }

        const newTypeOfEquipment = {
            ...req.body,
        };

        const typeOfEquipmentUpdated = await TypeOfEquipment.findByIdAndUpdate(
            typeOfEquipmentId,
            newTypeOfEquipment,
            { new: true }
        );

        res.json({
            ok: true,
            msg: 'Tipo de equipamiento actualizado correctamente.',
            typeOfEquipment: typeOfEquipmentUpdated,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor.',
        });
    }
};

const deleteTypeOfEquipment = async (req, res = response) => {
    const typeOfEquipmentId = req.params.id;

    try {
        // Verificar si el tipo de equipamiento existe
        const typeOfEquipment = await TypeOfEquipment.findById(typeOfEquipmentId);
        if (!typeOfEquipment) {
            return res.status(404).json({
                ok: false,
                msg: 'El tipo de equipamiento no existe.',
            });
        }

        await TypeOfEquipment.findByIdAndDelete(typeOfEquipmentId);

        res.json({
            ok: true,
            msg: 'Tipo de equipamiento eliminado correctamente.',
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor.',
        });
    }
}

module.exports = {
    getTypesOfEquipments,
    createTypeOfEquipment,
    updateTypeOfEquipment,
    deleteTypeOfEquipment,
};