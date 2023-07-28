const { response } = require("express");
const Board = require("../models/Board");
const Sensor = require("../models/Sensor");
const TypeOfBoard = require("../models/TypeOfBoard");
const Environment = require("../models/Environment");
const { Types } = require("mongoose");

/**
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de búsqueda es completada.
 */
const getBoards = async (req, res = response) => {
  try {
    const boards = await Board.find();
    res.json({
      ok: true,
      boards,
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
 * Crea una nueva placa y la guarda en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de creación es completada.
 */
const createBoard = async (req, res = response) => {
  const { name, typeOfBoardId, environmentId } = req.body;
  try {
    
    // Verificar si el ID del tipo de placa es válido
    if (!Types.ObjectId.isValid(typeOfBoardId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de tipo de placa inválido.",
      });
    }

    // Verificar si el ID del ambiente es válido
    if (!Types.ObjectId.isValid(environmentId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de ambiente inválido.",
      });
    }

    // Verificar si el tipo de placa existe
    const typeOfBoardExists = await TypeOfBoard.findById(typeOfBoardId);
    if (!typeOfBoardExists) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de placa no existe.",
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

    // Verificar si la placa ya existe
    let boardExists = await Board.findOne({
      name,
      environment: environmentId,
      typeOfBoard: typeOfBoardId,
    });
    if (boardExists) {
      return res.status(400).json({
        ok: false,
        msg: "La placa ya existe en el ambiente.",
      });
    }

    // Guardar placa
    const boardDB = await Board.create({
      name,
      typeOfBoard: typeOfBoardId,
      environment: environmentId,
    });

    res.json({
      ok: true,
      msg: "Placa creada con éxito.",
      board: boardDB,
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
 * Actualiza una placa existente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de actualización es completada.
 */
const updateBoard = async (req, res = response) => {
  const boardId = req.params.id;
  const { name, typeOfBoardId, environmentId } = req.body;

  try {
    // Verificar si el ID de la placa es válido
    if (!Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de placa inválido.",
      });
    }

    // Verificar si la placa existe
    let boardExists = await Board.findById(boardId);
    if (!boardExists) {
      return res.status(404).json({
        ok: false,
        msg: "La placa que intenta actualizar no existe.",
      });
    }

    // Verificar si el ID del tipo de placa es válido
    if (!Types.ObjectId.isValid(typeOfBoardId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de tipo de placa inválido.",
      });
    }

    // Verificar si el tipo de placa existe
    let typeOfBoardExists = await TypeOfBoard.findById(typeOfBoardId);
    if (!typeOfBoardExists) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de placa no existe.",
      });
    }

    // Verificar si el ID del ambiente es válido
    if (!Types.ObjectId.isValid(environmentId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de ambiente inválido.",
      });
    }

    // Verificar si el ambiente existe
    let environmentExists = await Environment.findById(environmentId);
    if (!environmentExists) {
      return res.status(404).json({
        ok: false,
        msg: "El ambiente no existe.",
      });
    }

    // Verificar si la placa ya existe en el ambiente
    boardExists = await Board.findOne({
      name,
      environment: environmentId,
      typeOfBoard: typeOfBoardId
    });
    if (boardExists && boardExists.id != boardId) {
      return res.status(400).json({
        ok: false,
        msg: "La placa ya existe en el ambiente.",
      });
    }

    // Actualizar placa
    const newBoard = {
      name,
      typeOfBoard: typeOfBoardId,
      environment: environmentId,
    };

    const boardBD = await Board.findByIdAndUpdate(boardId, newBoard, {
      new: true,
    });

    res.json({
      ok: true,
      msg: "Placa actualizada con éxito.",
      board: boardBD,
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
 * Elimina una placa existente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de eliminación es completada.
 */
const deleteBoard = async (req, res = response) => {
  const boardId = req.params.id;

  try {
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

    // Verificar si la placa está siendo utilizada en algún Sensor
    const sensors = await Sensor.exists({ board: boardId });
    if (sensors) {
      return res.status(400).json({
        ok: false,
        msg: "La placa está siendo utilizada por algún sensor.",
      });
    }

    // Eliminar placa
    await Board.findByIdAndDelete(boardId);

    res.json({
      ok: true,
      msg: "Placa eliminada con éxito.",
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
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
};
