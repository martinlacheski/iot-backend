const { response } = require("express");
const Sensor = require("../models/Sensor");
const TypeOfSensor = require("../models/TypeOfSensor");
const Board = require("../models/Board");
const { Types } = require("mongoose");

/**
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de búsqueda es completada.
 */
const getSensors = async (req, res = response) => {
  try {
    const sensors = await Sensor.find()
      .populate("typeOfSensor", "name")
      .populate("board", "name");
    res.json({
      ok: true,
      sensors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

/** Crea un nuevo sensor y lo guarda en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de creación es completada.
 */
const createSensor = async (req, res = response) => {
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim().toUpperCase();
    }
  }
  const { name, typeOfSensorId, boardId } = req.body;

  try {
    // Verificar si el ID del tipo de sensor es válido
    if (!Types.ObjectId.isValid(typeOfSensorId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de tipo de sensor inválido.",
      });
    }

    // Verificar si el tipo de sensor existe
    const typeOfSensorExists = await TypeOfSensor.findById(typeOfSensorId);
    if (!typeOfSensorExists) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de sensor no existe.",
      });
    }

    // Verificar si el ID de la placa es válido
    if (!Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de placa inválido.",
      });
    }

    // Verificar si la placa existe
    const boardExists = await Board.findById(boardId);
    if (!boardExists) {
      return res.status(404).json({
        ok: false,
        msg: "La placa no existe.",
      });
    }

    // Verificar si el sensor ya existe
    let sensorExists = await Sensor.findOne({
      name,
      board: boardId,
      typeOfSensor: typeOfSensorId,
    });
    if (sensorExists) {
      return res.status(400).json({
        ok: false,
        msg: "¡El sensor que intenta crear ya existe!",
      });
    }

    // Guardar sensor
    const sensorDB = await Sensor.create({
      name,
      typeOfSensor: typeOfSensorId,
      board: boardId,
    });

    res.json({
      ok: true,
      msg: "¡Sensor creado correctamente!",
      sensor: sensorDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

/** Actualiza un sensor existente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de actualización es completada.
 */
const updateSensor = async (req, res = response) => {
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim().toUpperCase();
    }
  }
  const sensorId = req.params.id;
  const { name, typeOfSensorId, boardId } = req.body;

  try {
    // Verificar si el ID del sensor es válido
    if (!Types.ObjectId.isValid(sensorId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de sensor inválido.",
      });
    }

    // Verificar si el sensor existe
    let sensorExists = await Sensor.findById(sensorId);
    if (!sensorExists) {
      return res.status(404).json({
        ok: false,
        msg: "El sensor que intenta actualizar no existe.",
      });
    }

    // Verificar si el ID del tipo de sensor es válido
    if (!Types.ObjectId.isValid(typeOfSensorId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de tipo de sensor inválido.",
      });
    }

    // Verificar si el tipo de sensor existe
    let typeOfSensorExists = TypeOfSensor.findById(typeOfSensorId);
    if (!typeOfSensorExists) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de sensor no existe.",
      });
    }

    // Verificar si el ID de la placa es válido
    if (!Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de placa inválido.",
      });
    }

    // Verificar si la placa existe
    let board = Board.findById(boardId);
    if (!board) {
      return res.status(404).json({
        ok: false,
        msg: "La placa no existe.",
      });
    }

    // Verificar si el sensor ya existe en la placa y el tipo de sensor
    sensorExists = await Sensor.findOne({
      name,
      board: boardId,
      typeOfSensor: typeOfSensorId,
    });
    if (sensorExists && sensorExists.id != sensorId) {
      return res.status(400).json({
        ok: false,
        msg: "¡El sensor que intenta actualizar ya existe!",
      });
    }

    // Actualizar sensor
    const newSensor = {
      ...req.body,
      typeOfSensor: typeOfSensorId,
      board: boardId,
    };

    const sensorDB = await Sensor.findByIdAndUpdate(sensorId, newSensor, {
      new: true,
    });

    res.json({
      ok: true,
      msg: "¡Sensor actualizado correctamente!",
      sensor: sensorDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

/** Elimina un sensor existente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de eliminación es completada.
 */
const deleteSensor = async (req, res = response) => {
  const sensorId = req.params.id;

  try {
    // Verificar si el ID del sensor es válido
    if (!Types.ObjectId.isValid(sensorId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de sensor inválido.",
      });
    }

    // Verificar si el sensor existe
    const sensorExists = await Sensor.findById(sensorId);
    if (!sensorExists) {
      return res.status(404).json({
        ok: false,
        msg: "¡El sensor que intenta eliminar no existe!",
      });
    }

    // Eliminar sensor
    await Sensor.updateOne({ _id: sensorId }, { isDeleted: true });

    res.json({
      ok: true,
      msg: "¡Sensor eliminado correctamente!",
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
  getSensors,
  createSensor,
  updateSensor,
  deleteSensor,
};
