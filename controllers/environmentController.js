const { response } = require("express");
const Environment = require("../models/Environment");
const TypeOfEnvironment = require("../models/TypeOfEnvironment");
const Branch = require("../models/Branch");
const Equipment = require("../models/Equipment");

const getEnvironments = async (req, res = response) => {
    try {
        const environments = await Environment.find();
        res.json({
            ok: true,
            environments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor.",
        });
    }
};

const createEnvironment = async (req, res = response) => {
    const environment = new Environment(req.body);
    try {
        environment.typeOfEnvironment = req.body.typeOfEnvironmentId;
        environment.branch = req.body.branchId;

        // Verificar si el tipo de ambiente existe
        const typeOfEnvironmentExists = await TypeOfEnvironment.findById(environment.typeOfEnvironment);
        if (!typeOfEnvironmentExists) {
            return res.status(404).json({
                ok: false,
                msg: "El tipo de ambiente no existe.",
            });
        }

        // Verificar si la sucursal existe
        const branchExists = await Branch.findById(environment.branch);
        if (!branchExists) {
            return res.status(404).json({
                ok: false,
                msg: "La sucursal no existe.",
            });
        }

        // Si el ambiente tiene equipos, verificar que existan
        if (environment.equipments?.length > 0) {
            for (let i = 0; i < environment.equipments.length; i++) {
                const equipmentExists = await Equipment.findById(environment.equipments[i]);
                if (!equipmentExists) {
                    return res.status(404).json({
                        ok: false,
                        msg: "Equipamiento no encontrado.",
                    });
                }
            }
        }

        const environmentDB = await environment.save();

        res.json({
            ok: true,
            msg: "Ambiente creado correctamente.",
            environment: environmentDB,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor.",
        });
    }
};

const updateEnvironment = async (req, res = response) => {
    const environmentId = req.params.id;
    const environment = req.body;

    try {
        // Verificar si el ambiente existe
        let environmentExists = await Environment.findById(environmentId);
        if (!environmentExists) {
            return res.status(404).json({
                ok: false,
                msg: "El ambiente no existe.",
            });
        }

        // Verificar si el tipo de ambiente existe
        const typeOfEnvironmentExists = await TypeOfEnvironment.findById(req.body.typeOfEnvironmentId);
        if (!typeOfEnvironmentExists) {
            return res.status(404).json({
                ok: false,
                msg: "El tipo de ambiente no existe.",
            });
        }

        // Verificar si la sucursal existe
        const branchExists = await Branch.findById(req.body.branchId);
        if (!branchExists) {
            return res.status(404).json({
                ok: false,
                msg: "La sucursal no existe.",
            });
        }

        // Si el ambiente tiene equipos, verificar que existan
        // console.log(environment.equipments);
        if (environment.equipments?.length > 0) {
            for (let i = 0; i < environment.equipments.length; i++) {
                const equipmentExists = await Equipment.findById(environment.equipments[i]);
                if (!equipmentExists) {
                    return res.status(404).json({
                        ok: false,
                        msg: "Equipamiento no encontrado.",
                    });
                }
            }
        }

        const environmentDB = await Environment.findByIdAndUpdate(environmentId, environment, { new: true });

        res.json({
            ok: true,
            msg: "Ambiente actualizado correctamente.",
            environment: environmentDB,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor.",
        });
    }
};

const deleteEnvironment = async (req, res = response) => {
    const environmentId = req.params.id;

    try {
        // Verificar si el ambiente existe
        const environmentExists = await Environment.findById(environmentId);
        if (!environmentExists) {
            return res.status(404).json({
                ok: false,
                msg: "El ambiente no existe.",
            });
        }

        // Verificar si el ambiente está siendo usado
        const environmentInUse = await Environment.findOne({ _id: environmentId, equipments: { $exists: true, $not: { $size: 0 } } });
        if (environmentInUse) {
            return res.status(400).json({
                ok: false,
                msg: "El ambiente está siendo usado.",
            });
        }

        await Environment.findByIdAndDelete(environmentId);

        res.json({
            ok: true,
            msg: "Ambiente eliminado correctamente.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor.",
        });
    }
}

module.exports = {
    getEnvironments,
    createEnvironment,
    updateEnvironment,
    deleteEnvironment,
}