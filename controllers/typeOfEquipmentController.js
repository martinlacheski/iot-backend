const { response } = require('express');
const TypeOfEquipment = require('../models/TypeOfEquipment');
const Equipment = require('../models/Equipment');
const { Types } = require('mongoose');

/**
 * Obtiene todos los tipos de equipamientos de la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de búsqueda es completada.
 */ 
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

/**
 * Crea un nuevo tipo de equipamiento y lo guarda en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de creación es completada.
 */
const createTypeOfEquipment = async (req, res = response) => {
    const typeOfEquipment = new TypeOfEquipment(req.body);
    try {
        const typeOfEquipmentDB = await typeOfEquipment.save();
        res.json({
            ok: true,
            msg: 'Tipo de equipamiento creado correctamente.',
            typeOfEquipment: typeOfEquipmentDB,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                msg: 'El tipo de equipamiento que intenta crear ya existe.',
            });
        }
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor.',
        });
    }
};

/**
 * Actualiza un tipo de equipamiento existente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de actualización es completada.
 */
const updateTypeOfEquipment = async (req, res = response) => {
    const typeOfEquipmentId = req.params.id;
    try {
        // Verificar si el ID del tipo de equipamiento es válido
        if (!Types.ObjectId.isValid(typeOfEquipmentId)) {
            return res.status(400).json({
                ok: false,
                msg: 'ID de tipo de equipamiento inválido.',
            });
        }

        // Verificar si el tipo de equipamiento existe
        const typeOfEquipment = await TypeOfEquipment.findById(typeOfEquipmentId);
        if (!typeOfEquipment) {
            return res.status(404).json({
                ok: false,
                msg: 'El tipo de equipamiento no existe.',
            });
        }

        // Verificar si el tipo de equipamiento ya existe (si se está actualizando el nombre)
        if (req.body.name !== typeOfEquipment.name) {
            const typeOfEquipmentExists = await TypeOfEquipment.findOne({ name: req.body.name });
            if (typeOfEquipmentExists) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El tipo de equipamiento que intenta actualizar ya existe.',
                });
            }
        }

        // Actualizar el tipo de equipamiento
        const typeOfEquipmentUpdated = await TypeOfEquipment.findByIdAndUpdate(typeOfEquipmentId, req.body, { new: true });

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

/**
 * Elimina un tipo de equipamiento de la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de eliminación es completada.
 */
const deleteTypeOfEquipment = async (req, res = response) => {
    const typeOfEquipmentId = req.params.id;

    try {
        // Verificar si el ID del tipo de equipamiento es válido
        if (!Types.ObjectId.isValid(typeOfEquipmentId)) {
            return res.status(400).json({
                ok: false,
                msg: 'ID de tipo de equipamiento inválido.',
            });
        }

        // Verificar si el tipo de equipamiento existe
        const typeOfEquipment = await TypeOfEquipment.findById(typeOfEquipmentId);
        if (!typeOfEquipment) {
            return res.status(404).json({
                ok: false,
                msg: 'El tipo de equipamiento no existe.',
            });
        }

        // Verificar si el tipo de equipamiento está siendo utilizado por algún equipamiento
        const equipments = await Equipment.exists({ typeOfEquipment: typeOfEquipmentId });
        if (equipments) {
            return res.status(400).json({
                ok: false,
                msg: 'El tipo de equipamiento está siendo utilizado por algún equipamiento.',
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