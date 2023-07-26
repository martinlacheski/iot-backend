const { response } = require('express');
const TypeOfSensor = require('../models/TypeOfSensor');

const getTypesOfSensor = async (req, res = response) => {
    try {
        const typesOfSensor = await TypeOfSensor.find();
        res.json({
            ok: true,
            typesOfSensor
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor.'
        });
    }
};

const createTypeOfSensor = async (req, res = response) => {
    const typeOfSensor = new TypeOfSensor(req.body);
    try {
        // Verificar si el tipo de sensor ya existe
        let typeOfSensorExists = await TypeOfSensor.findOne({ name: typeOfSensor.name });
        if (typeOfSensorExists) {
            return res.status(400).json({
                ok: false,
                msg: 'El tipo de sensor ya existe.'
            });
        }

        const typeOfSensorDB = await typeOfSensor.save();

        res.json({
            ok: true,
            msg: 'Tipo de sensor creado correctamente.',
            typeOfSensor: typeOfSensorDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor.'
        });
    }
};

const updateTypeOfSensor = async (req, res = response) => {
    const typeOfSensorId = req.params.id;

    try {
        // Verificar si el tipo de sensor existe
        const typeOfSensor = await TypeOfSensor.findById(typeOfSensorId);
        if (!typeOfSensor) {
            return res.status(404).json({
                ok: false,
                msg: 'El tipo de sensor no existe.'
            });
        }

        // Verificar si el nuevo nombre del tipo de sensor ya existe
        const { name } = req.body;
        if (name) {
            let typeOfSensorExists = await TypeOfSensor.findOne({ name });
            if (typeOfSensorExists && typeOfSensorExists.name !== typeOfSensor.name) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El tipo de sensor ya existe.'
                });
            }
        }

        const newTypeOfSensor = {
            ...req.body
        };

        const typeOfSensorUpdated = await TypeOfSensor.findByIdAndUpdate(typeOfSensorId, newTypeOfSensor, { new: true });

        res.json({
            ok: true,
            msg: 'Tipo de sensor actualizado correctamente.',
            typeOfSensor: typeOfSensorUpdated
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor.'
        });
    }
};

const deleteTypeOfSensor = async (req, res = response) => {
    const typeOfSensorId = req.params.id;

    try {
        // Verificar si el tipo de sensor existe
        const typeOfSensor = await TypeOfSensor.findById(typeOfSensorId);
        if (!typeOfSensor) {
            return res.status(404).json({
                ok: false,
                msg: 'El tipo de sensor no existe.'
            });
        }

        await TypeOfSensor.findByIdAndDelete(typeOfSensorId);

        res.json({
            ok: true,
            msg: 'Tipo de sensor eliminado correctamente.'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor.'
        });
    }
};

module.exports = {
    getTypesOfSensor,
    createTypeOfSensor,
    updateTypeOfSensor,
    deleteTypeOfSensor
}