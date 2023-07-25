const { response } = require('express');
const TypeOfEnvironment = require('../models/TypeOfEnvironment');

const getTypesOfEnvironments = async (req, res = response) => {
    try {
        const typeOfEnvironments = await TypeOfEnvironment.find();
        res.json({
            ok: true,
            typeOfEnvironments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor.',
        });
    }
};

const createTypeOfEnvironment = async (req, res = response) => {
    const typeOfEnvironment = new TypeOfEnvironment(req.body);
    try {
        // Verificar si el tipo de ambiente ya existe
        let typeOfEnvironmentExists = await TypeOfEnvironment.findOne({
            name: typeOfEnvironment.name,
        });
        if (typeOfEnvironmentExists) {
            return res.status(400).json({
                ok: false,
                msg: 'El tipo de ambiente ya existe.',
            });
        }

        const typeOfEnvironmentDB = await typeOfEnvironment.save();

        res.json({
            ok: true,
            msg: 'Tipo de ambiente creado correctamente.',
            typeOfEnvironment: typeOfEnvironmentDB,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor.',
        });
    }
};

const updateTypeOfEnvironment = async (req, res = response) => {
    const typeOfEnvironmentId = req.params.id;

    try {
        // Verificar si el tipo de ambiente existe
        const typeOfEnvironment = await TypeOfEnvironment.findById(typeOfEnvironmentId);
        if (!typeOfEnvironment) {
            return res.status(404).json({
                ok: false,
                msg: 'El tipo de ambiente no existe.',
            });
        }

        // Verificar si el tipo de ambiente ya existe
        const { name } = req.body;
        if (name) {
            let typeOfEnvironmentExists = await TypeOfEnvironment.findOne({
                name,
            });
            if (typeOfEnvironmentExists && typeOfEnvironment.name !== name) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El tipo de ambiente ya existe.',
                });
            }
        }

        const newTypeOfEnvironment = {
            ...req.body,
        };

        const typeOfEnvironmentUpdated = await TypeOfEnvironment.findByIdAndUpdate(
            typeOfEnvironmentId,
            newTypeOfEnvironment,
            { new: true }
        );

        res.json({
            ok: true,
            msg: 'Tipo de ambiente actualizado correctamente.',
            typeOfEnvironment: typeOfEnvironmentUpdated,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor.',
        });
    }
}

const deleteTypeOfEnvironment = async (req, res = response) => {
    const typeOfEnvironmentId = req.params.id;

    try {
        // Verificar si el tipo de ambiente existe
        const typeOfEnvironment = await TypeOfEnvironment.findById(typeOfEnvironmentId);
        if (!typeOfEnvironment) {
            return res.status(404).json({
                ok: false,
                msg: 'El tipo de ambiente no existe.',
            });
        }

        await TypeOfEnvironment.findByIdAndDelete(typeOfEnvironmentId);

        res.json({
            ok: true,
            msg: 'Tipo de ambiente eliminado correctamente.',
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor.',
        });
    }
}

module.exports = {
    getTypesOfEnvironments,
    createTypeOfEnvironment,
    updateTypeOfEnvironment,
    deleteTypeOfEnvironment,
};