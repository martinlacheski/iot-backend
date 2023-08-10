const { response } = require("express");
const Equipment = require("../../models/admin/Equipment");
const TypeOfEquipment = require("../../models/admin/TypeOfEquipment");
const Environment = require("../../models/admin/Environment");
const { Types } = require("mongoose");

/**
 * Obtiene todos los equipos de la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de búsqueda es completada.
 */
const getEquipments = async (req, res = response) => {
  try {
    const equipments = await Equipment.find().populate(
      "typeOfEquipment",
      "name"
    );
    res.json({
      ok: true,
      equipments,
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
 * Crea un nuevo equipo y lo guarda en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de creación es completada.
 */
const createEquipment = async (req, res = response) => {
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim().toUpperCase();
    }
  }
  try {
    const { typeOfEquipmentId, description } = req.body;
    // Verificar si el ID del tipo de equipo es válido
    if (!Types.ObjectId.isValid(typeOfEquipmentId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de tipo de equipo inválido.",
      });
    }

    // Verificar si el tipo de equipo existe
    const typeOfEquipmentExists = await TypeOfEquipment.findById(
      typeOfEquipmentId
    );
    if (!typeOfEquipmentExists) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de equipo no existe.",
      });
    }

    // Verificar si el equipo ya existe
    const equipmentExists = await Equipment.findOne({
      description,
      typeOfEquipment: typeOfEquipmentId,
    });
    if (equipmentExists) {
      return res.status(400).json({
        ok: false,
        msg: "¡El equipamiento que intenta crear ya existe!",
      });
    }

    const equipmentDB = await new Equipment({
      ...req.body,
      typeOfEquipment: typeOfEquipmentId,
    }).save();

    res.json({
      ok: true,
      msg: "¡Equipamiento creado correctamente!",
      equipment: equipmentDB,
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
 * Actualiza un equipo existente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de actualización es completada.
 */
const updateEquipment = async (req, res = response) => {
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim().toUpperCase();
    }
  }
  const equipmentId = req.params.id;
  try {
    // Verificar si el ID del equipo es válido
    if (!Types.ObjectId.isValid(equipmentId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de equipo inválido.",
      });
    }

    // Verificar si el equipo existe
    let equipmentExists = await Equipment.findById(equipmentId);
    if (!equipmentExists) {
      return res.status(404).json({
        ok: false,
        msg: "El equipo que intenta actualizar no existe.",
      });
    }

    // Verificar si el tipo de equipo existe
    const typeOfEquipmentExists = await TypeOfEquipment.findById(
      req.body.typeOfEquipmentId
    );
    if (!typeOfEquipmentExists) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de equipo que desea asignar no existe.",
      });
    }

    // Verificar si el equipo a actualizar ya existe
    equipmentExists = await Equipment.findOne({
      description: req.body.description,
      typeOfEquipment: req.body.typeOfEquipmentId,
    });
    if (equipmentExists && equipmentExists.id != equipmentId) {
      return res.status(400).json({
        ok: false,
        msg: "¡El equipamiento que intenta actualizar ya existe!",
      });
    }

    const newEquipment = {
      ...req.body,
      typeOfEquipment: req.body.typeOfEquipmentId,
    };

    const equipmentDB = await Equipment.findByIdAndUpdate(
      equipmentId,
      newEquipment,
      { new: true }
    );

    res.json({
      ok: true,
      msg: "¡Equipamiento actualizado correctamente!",
      equipment: equipmentDB,
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
 * Elimina un equipo existente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de eliminación es completada.
 */
const deleteEquipment = async (req, res = response) => {
  const equipmentId = req.params.id;
  try {
    // Verificar si el ID del equipo es válido
    if (!Types.ObjectId.isValid(equipmentId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de equipo inválido.",
      });
    }

    // Verificar si el equipo existe
    let equipmentExists = await Equipment.findById(equipmentId);
    if (!equipmentExists) {
      return res.status(404).json({
        ok: false,
        msg: "El equipo no existe.",
      });
    }

    const usingEquipment = await Environment.findOne({
      "equipments.equipment": equipmentId,
    });
    if (usingEquipment) {
      return res.status(400).json({
        ok: false,
        msg: "¡El equipamiento está siendo utilizado por algún ambiente!",
      });
    }

    // Eliminar equipo
    await Equipment.updateOne({ _id: equipmentId }, { isDeleted: true });

    res.json({
      ok: true,
      msg: "¡Equipamiento eliminado correctamente!",
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
  getEquipments,
  createEquipment,
  updateEquipment,
  deleteEquipment,
};
