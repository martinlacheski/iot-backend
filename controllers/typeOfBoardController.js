const { response } = require("express");
const TypeOfBoard = require("../models/TypeOfBoard");
const Board = require("../models/Board");
const { Types } = require("mongoose");

/**
 * Obtiene todos los tipos de placas de la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de búsqueda es completada.
 */
const getTypesOfBoards = async (req, res = response) => {
  try {
    const typeOfBoards = await TypeOfBoard.find();
    res.json({
      ok: true,
      typeOfBoards,
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
 * Crea un nuevo tipo de placa y lo guarda en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de creación es completada.
 */
const createTypeOfBoard = async (req, res = response) => {
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim().toUpperCase();
    }
  }
  const typeOfBoard = new TypeOfBoard(req.body);
  try {
    const typeOfBoardDB = await typeOfBoard.save();
    res.json({
      ok: true,
      msg: "¡Tipo de placa creado correctamente!",
      typeOfBoard: typeOfBoardDB,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        ok: false,
        msg: "¡El tipo de placa que intenta crear ya existe!",
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
 * Actualiza un tipo de placa existente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de actualización es completada.
 */
const updateTypeOfBoard = async (req, res = response) => {
  const typeOfBoardId = req.params.id;
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim().toUpperCase();
    }
  }

  try {
    // Verificar si el ID del tipo de placa es válido
    if (!Types.ObjectId.isValid(typeOfBoardId)) {
      return res.status(404).json({
        ok: false,
        msg: "ID del tipo de placa inválido.",
      });
    }

    // Verificar si el tipo de placa existe
    const typeOfBoard = await TypeOfBoard.findById(typeOfBoardId);
    if (!typeOfBoard) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de placa no existe.",
      });
    }

    // Verificar si el tipo de placa ya existe (si se está actualizando el nombre del tipo de placa)
    if (req.body.name !== typeOfBoard.name) {
      const typeOfBoardExists = await TypeOfBoard.findOne({
        name: req.body.name,
      });
      if (typeOfBoardExists) {
        return res.status(400).json({
          ok: false,
          msg: "¡El tipo de placa que intenta actualizar ya existe!",
        });
      }
    }

    const typeOfBoardUpdated = await TypeOfBoard.findByIdAndUpdate(
      typeOfBoardId,
      req.body,
      { new: true }
    );

    res.json({
      ok: true,
      msg: "¡Tipo de placa actualizado correctamente!",
      typeOfBoard: typeOfBoardUpdated,
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
 * Elimina un tipo de placa existente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de eliminación es completada.
 */
const deleteTypeOfBoard = async (req, res = response) => {
  const typeOfBoardId = req.params.id;

  try {
    // Verificar si el ID del tipo de placa es válido
    if (!Types.ObjectId.isValid(typeOfBoardId)) {
      return res.status(404).json({
        ok: false,
        msg: "ID del tipo de placa inválido.",
      });
    }

    // Verificar si el tipo de placa existe
    const typeOfBoard = await TypeOfBoard.findById(typeOfBoardId);
    if (!typeOfBoard) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de placa no existe.",
      });
    }

    // Verificar si el tipo de placa está siendo utilizado por alguna placa
    const boards = await Board.exists({ typeOfBoard: typeOfBoardId });
    if (boards) {
      return res.status(400).json({
        ok: false,
        msg: "¡El tipo de placa que intenta eliminar está siendo utilizado por alguna placa!",
      });
    }

    await TypeOfBoard.updateOne({ _id: typeOfBoardId }, { isDeleted: true });

    res.json({
      ok: true,
      msg: "¡Tipo de placa eliminado correctamente!",
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
  getTypesOfBoards,
  createTypeOfBoard,
  updateTypeOfBoard,
  deleteTypeOfBoard,
};
