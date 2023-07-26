const { response } = require("express");
const Board = require("../models/Board");
const TypeOfBoard = require("../models/TypeOfBoard");
const Environment = require("../models/Environment");

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

const createBoard = async (req, res = response) => {
  const board = new Board(req.body);
  try {
    board.typeOfBoard = req.body.typeOfBoardId;
    board.environment = req.body.environmentId;

    // Verificar si el tipo de placa existe
    const typeOfBoardExists = await TypeOfBoard.findById(board.typeOfBoard);
    if (!typeOfBoardExists) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de placa no existe.",
      });
    }

    // Verificar si el ambiente existe
    const environmentExists = await Environment.findById(board.environment);
    if (!environmentExists) {
      return res.status(404).json({
        ok: false,
        msg: "El ambiente no existe.",
      });
    }

    // Verificar si la placa ya existe
    let boardExists = await Board.findOne({
      name: board.name,
      environment: board.environment,
    });
    if (boardExists) {
      return res.status(400).json({
        ok: false,
        msg: "La placa ya existe en el ambiente.",
      });
    }

    // Guardar placa
    await board.save();

    res.json({
      ok: true,
      board,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

const updateBoard = async (req, res = response) => {
  const boardId = req.params.id;

  try {
    // Verificar si la placa existe
    let boardExists = await Board.findById(boardId);
    if (!boardExists) {
      return res.status(404).json({
        ok: false,
        msg: "La placa no existe.",
      });
    }

    // Verificar si el tipo de placa existe
    let typeOfBoardExists = await TypeOfBoard.findById(req.body.typeOfBoardId);
    if (!typeOfBoardExists) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de placa no existe.",
      });
    }

    // Verificar si el ambiente existe
    let environmentExists = await Environment.findById(req.body.environmentId);
    if (!environmentExists) {
      return res.status(404).json({
        ok: false,
        msg: "El ambiente no existe.",
      });
    }

    // Verificar si la placa ya existe en el ambiente
    boardExists = await Board.findOne({
      name: req.body.name,
      environment: req.body.environmentId,
    });
    if (boardExists && boardExists.id != boardId) {
      return res.status(400).json({
        ok: false,
        msg: "La placa ya existe en el ambiente.",
      });
    }

    // Actualizar placa
    const newBoard = {
      ...req.body,
      typeOfBoard: req.body.typeOfBoardId,
      environment: req.body.environmentId,
    };

    const boardBD = await Board.findByIdAndUpdate(boardId, newBoard, {
      new: true,
    });

    res.json({
      ok: true,
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

const deleteBoard = async (req, res = response) => {
  const boardId = req.params.id;

  try {
    // Verificar si la placa existe
    const boardExists = await Board.findById(boardId);
    if (!boardExists) {
      return res.status(404).json({
        ok: false,
        msg: "La placa no existe.",
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
