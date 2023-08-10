const { response } = require("express");
const TypeOfSensor = require("../../models/admin/TypeOfSensor");
const Sensor = require("../../models/admin/Sensor");
const { Types } = require("mongoose");

/**
 * Obtiene todos los tipos de sensores de la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de búsqueda es completada.
 */
const getTypesOfSensor = async (req, res = response) => {
  try {
    const typesOfSensor = await TypeOfSensor.find();
    res.json({
      ok: true,
      typesOfSensor,
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
 * Crea un nuevo tipo de sensor y lo guarda en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de creación es completada.
 */
const createTypeOfSensor = async (req, res = response) => {
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim().toUpperCase();
    }
  }
  const typeOfSensor = new TypeOfSensor(req.body);
  try {
    const typeOfSensorDB = await typeOfSensor.save();
    res.json({
      ok: true,
      msg: "¡Tipo de sensor creado correctamente!",
      typeOfSensor: typeOfSensorDB,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        ok: false,
        msg: "¡El tipo de sensor que intenta crear ya existe!",
      });
    }
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

/**
 * Actualiza un tipo de sensor existente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de actualización es completada.
 */
const updateTypeOfSensor = async (req, res = response) => {
  const typeOfSensorId = req.params.id;
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim().toUpperCase();
    }
  }
  try {
    // Verificar si el ID del tipo de sensor es válido
    if (!Types.ObjectId.isValid(typeOfSensorId)) {
      return res.status(400).json({
        ok: false,
        msg: "El ID del tipo de sensor no es válido.",
      });
    }

    // Verificar si el tipo de sensor existe
    const typeOfSensor = await TypeOfSensor.findById(typeOfSensorId);
    if (!typeOfSensor) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de sensor no existe.",
      });
    }

    // Verificar si el nuevo nombre del tipo de sensor ya existe
    if (req.body.name !== typeOfSensor.name) {
      const typeOfSensorExists = await TypeOfSensor.findOne({
        name: req.body.name,
      });
      if (typeOfSensorExists) {
        return res.status(400).json({
          ok: false,
          msg: "¡El tipo de sensor que intenta actualizar ya existe!",
        });
      }
    }

    const typeOfSensorUpdated = await TypeOfSensor.findByIdAndUpdate(
      typeOfSensorId,
      req.body,
      { new: true }
    );
    res.json({
      ok: true,
      msg: "¡Tipo de sensor actualizado correctamente!",
      typeOfSensor: typeOfSensorUpdated,
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
 * Elimina un tipo de sensor existente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de eliminación es completada.
 */
const deleteTypeOfSensor = async (req, res = response) => {
  const typeOfSensorId = req.params.id;

  try {
    // Verificar si el ID del tipo de sensor es válido
    if (!Types.ObjectId.isValid(typeOfSensorId)) {
      return res.status(400).json({
        ok: false,
        msg: "El ID del tipo de sensor no es válido.",
      });
    }

    // Verificar si el tipo de sensor existe
    const typeOfSensor = await TypeOfSensor.findById(typeOfSensorId);
    if (!typeOfSensor) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de sensor no existe.",
      });
    }

    // Verificar si el tipo de sensor está siendo utilizado por algún sensor
    const sensor = await Sensor.findOne({ typeOfSensor: typeOfSensorId });
    if (sensor) {
      return res.status(400).json({
        ok: false,
        msg: "¡El tipo de sensor está siendo utilizado por algún sensor!",
      });
    }

    await TypeOfSensor.updateOne({ _id: typeOfSensorId }, { isDeleted: true });

    res.json({
      ok: true,
      msg: "¡Tipo de sensor eliminado correctamente!",
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
  getTypesOfSensor,
  createTypeOfSensor,
  updateTypeOfSensor,
  deleteTypeOfSensor,
};
