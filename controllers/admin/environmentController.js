const { response } = require("express");
const Environment = require("../../models/admin/Environment");
const TypeOfEnvironment = require("../../models/admin/TypeOfEnvironment");
const Branch = require("../../models/admin/Branch");
const Equipment = require("../../models/admin/Equipment");
const Board = require("../../models/admin/Board");
const { Types } = require("mongoose");

/**
 * Obtiene todos los  ambientes de la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de búsqueda es completada.
 */
const getEnvironments = async (req, res = response) => {
  try {
    const environments = await Environment.find()
      .populate("typeOfEnvironment", "name")
      .populate("branch", "name")
      .populate("equipments.equipment", "description")
      .populate({
        path: "equipments.equipment",
        populate: { path: "typeOfEquipment", select: "name" },
      });
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

/**
 * Obtiene un ambiente de la base de datos por su ID.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de búsqueda es completada.
 */
const getEnvironmentById = async (req, res = response) => {
  const environmentId = req.params.id;

  try {
    // Verificar si el ID del ambiente es válido
    if (!Types.ObjectId.isValid(environmentId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de ambiente inválido.",
      });
    }

    const environment = await Environment.findOne({ _id: environmentId });
    
    if (!environment) {
      return res.status(404).json({
        ok: false,
        msg: "El ambiente no existe.",
      });
    } else {
      res.json({
        ok: true,
        environment,
      });
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

/**
 * Crea un nuevo ambiente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de creación es completada.
 * @throws {Error} Si algún error ocurre durante la creación del ambiente.
 */
const createEnvironment = async (req, res = response) => {
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim().toUpperCase();
    }
  }

  const { name, typeOfEnvironmentId, branchId } = req.body;
  try {
    // Verificar si el ID del tipo de ambiente es válido
    if (!Types.ObjectId.isValid(typeOfEnvironmentId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de tipo de ambiente inválido.",
      });
    }

    // Verificar si el ID de la sede es válido
    if (!Types.ObjectId.isValid(branchId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de sede inválido.",
      });
    }

    // Verificar si el tipo de ambiente existe
    const typeOfEnvironmentExists = await TypeOfEnvironment.findById(
      typeOfEnvironmentId
    );
    if (!typeOfEnvironmentExists) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de ambiente no existe.",
      });
    }

    // Verificar si la sede existe
    const branchExists = await Branch.findById(branchId);
    if (!branchExists) {
      return res.status(404).json({
        ok: false,
        msg: "La sede no existe.",
      });
    }

    // Verificar si el ambiente ya existe en la sede y tipo de ambiente
    let environmentExists = await Environment.findOne({
      name,
      branch: branchId,
      typeOfEnvironment: typeOfEnvironmentId,
    });

    if (environmentExists) {
      return res.status(400).json({
        ok: false,
        msg: "¡El ambiente ya existe en la sede y tipo de ambiente!",
      });
    }

    // Verificar si los equipos existen dentro de equipments
    const equipments = req.body.equipments || [];
    const ids = equipments.map((equipment) => equipment.equipment);

    if (ids.length > 0) {
      const equipmentExists = await Equipment.find({ _id: { $in: ids } });
      if (equipmentExists.length !== ids.length) {
        return res.status(404).json({
          ok: false,
          msg: "Equipamiento no encontrado.",
        });
      }
    }

    // Crear el objeto de ambiente
    const environmentData = {
      name,
      typeOfEnvironment: typeOfEnvironmentId,
      branch: branchId,
      floor: req.body.floor,
      room: req.body.room,
      capacity: req.body.capacity,
      surface: req.body.surface,
      equipments: req.body.equipments,
      observations: req.body.observations,
    };

    // Guardar el ambiente y manejar el error de índice único
    const environmentDB = await Environment.create(environmentData);

    res.json({
      ok: true,
      msg: "¡Ambiente creado correctamente!",
      environment: environmentDB,
    });
  } catch (error) {
    if (error.code === 11000) {
      // El error 11000 corresponde a un error de índice único duplicado
      return res.status(400).json({
        ok: false,
        msg: "¡Ya existe un ambiente con los mismos valores para nombre, sede y tipo de ambiente!",
      });
    }

    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

/** Actualiza un ambiente existente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de actualización es completada.
 */
const updateEnvironment = async (req, res = response) => {
  const environmentId = req.params.id;
  const environmentData = req.body;

  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim().toUpperCase();
    }
  }

  try {
    // Verificar si el ID del ambiente es válido
    if (!Types.ObjectId.isValid(environmentId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de ambiente inválido.",
      });
    }

    // Verificar si el ambiente existe
    const environmentExists = await Environment.findById(environmentId);
    if (!environmentExists) {
      return res.status(404).json({
        ok: false,
        msg: "El ambiente no existe.",
      });
    }

    // Verificar si el ID del tipo de ambiente es válido
    if (!Types.ObjectId.isValid(environmentData.typeOfEnvironmentId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de tipo de ambiente inválido.",
      });
    }

    // Verificar si el ID de la sede es válido
    if (!Types.ObjectId.isValid(environmentData.branchId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de sede inválido.",
      });
    }

    // Verificar si el tipo de ambiente existe
    const typeOfEnvironmentExists = await TypeOfEnvironment.findById(
      environmentData.typeOfEnvironmentId
    );
    if (!typeOfEnvironmentExists) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de ambiente no existe.",
      });
    }

    // Verificar si la sede existe
    const branchExists = await Branch.findById(environmentData.branchId);
    if (!branchExists) {
      return res.status(404).json({
        ok: false,
        msg: "La sede no existe.",
      });
    }

    // Verificar si los equipos existen
    const equipments = environmentData.equipments || [];
    const ids = equipments.map((equipment) => equipment.equipment);

    if (ids.length > 0) {
      const equipmentExists = await Equipment.find({ _id: { $in: ids } });
      if (equipmentExists.length !== ids.length) {
        return res.status(404).json({
          ok: false,
          msg: "Equipamiento no encontrado.",
        });
      }
    }

    const environmentDB = await Environment.findByIdAndUpdate(
      environmentId,
      environmentData,
      { new: true }
    );

    res.json({
      ok: true,
      msg: "¡Ambiente actualizado correctamente!",
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

/**
 * Elimina un ambiente de la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de eliminación es completada.
 * @throws {Error} Si algún error ocurre durante la eliminación del ambiente.
 */
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

    // Verificar si el ambiente está siendo referencia en la colección "Board"
    const environmentReferenced = await Board.exists({
      environment: environmentId,
    });
    if (environmentReferenced) {
      return res.status(400).json({
        ok: false,
        msg: "¡El ambiente está siendo referenciado en alguna placa!",
      });
    }

    await Environment.updateOne({ _id: environmentId }, { isDeleted: true });

    res.json({
      ok: true,
      msg: "¡Ambiente eliminado correctamente!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

module.exports = {
  getEnvironments,
  getEnvironmentById,
  createEnvironment,
  updateEnvironment,
  deleteEnvironment,
};
