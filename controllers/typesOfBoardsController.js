const { response } = require("express");
const TypeOfBoard = require("../models/TypeOfBoard");

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

const createTypeOfBoard = async (req, res = response) => {
  const typeOfBoard = new TypeOfBoard(req.body);
  try {
    // Verificar si el tipo de placa ya existe
    let typeOfBoardExists = await TypeOfBoard.findOne({
      name: typeOfBoard.name,
    });
    if (typeOfBoardExists) {
      return res.status(400).json({
        ok: false,
        msg: "El tipo de placa ya existe.",
      });
    }

    const typeOfBoardDB = await typeOfBoard.save();

    res.json({
      ok: true,
      msg: "Tipo de placa creado correctamente.",
      typeOfBoard: typeOfBoardDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

const updateTypeOfBoard = async (req, res = response) => {
  const typeOfBoardId = req.params.id;

  try {
    // Verificar si el tipo de placa existe
    const typeOfBoard = await TypeOfBoard.findById(typeOfBoardId);
    if (!typeOfBoard) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de placa no existe.",
      });
    }

    const newTypeOfBoard = {
      ...req.body,
    };

    const typeOfBoardUpdated = await TypeOfBoard.findByIdAndUpdate(
      typeOfBoardId,
      newTypeOfBoard,
      { new: true }
    );

    res.json({
      ok: true,
      msg: "Tipo de placa actualizado correctamente.",
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

const deleteTypeOfBoard = async (req, res = response) => {
  const typeOfBoardId = req.params.id;

  try {
    // Verificar si el tipo de placa existe
    const typeOfBoard = await TypeOfBoard.findById(typeOfBoardId);
    if (!typeOfBoard) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de placa no existe.",
      });
    }

    await TypeOfBoard.findByIdAndDelete(typeOfBoardId);

    res.json({
      ok: true,
      msg: "Tipo de placa eliminado correctamente.",
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