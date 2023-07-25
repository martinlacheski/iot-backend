const { response } = require("express");
const Equipment = require("../models/Equipment");
const TypeOfEquipment = require("../models/TypeOfEquipment");

const getEquipments = async (req, res = response) => {
  try {
    const equipments = await Equipment.find();
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

const createEquipment = async (req, res = response) => {
  const equipment = new Equipment(req.body);

  try {
    equipment.typeOfEquipment = req.body.typeOfEquipmentId;

    // Verificar si el tipo de equipo existe
    const typeOfEquipmentExists = await TypeOfEquipment.findById(
      equipment.typeOfEquipment
    );
    if (!typeOfEquipmentExists) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de equipo no existe.",
      });
    }

    // Verificar si el equipo ya existe
    const equipmentExists = await Equipment.findOne({
      description: equipment.description,
      typeOfEquipment: equipment.typeOfEquipment,
    });

    if (equipmentExists) {
      return res.status(400).json({
        ok: false,
        msg: "El equipo ya existe.",
      });
    }

    // Quantity must be greater than 0
    if (equipment.quantity < 1) {
      return res.status(400).json({
        ok: false,
        msg: "La cantidad debe ser mayor a 0.",
      });
    }

    const equipmentDB = await equipment.save();

    res.json({
      ok: true,
      msg: "Equipo creado correctamente.",
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

const updateEquipment = async (req, res = response) => {
  const equipmentId = req.params.id;

  try {
    // Verificar si el equipo existe
    let equipmentExists = await Equipment.findById(equipmentId);
    if (!equipmentExists) {
      return res.status(404).json({
        ok: false,
        msg: "El equipo no existe.",
      });
    }

    // Verificar si el tipo de equipo existe
    const typeOfEquipmentExists = await TypeOfEquipment.findById(
      req.body.typeOfEquipmentId
    );
    if (!typeOfEquipmentExists) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de equipo no existe.",
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
        msg: "El equipo ya existe.",
      });
    }

    // Quantity must be greater than 0
    if (req.body.quantity < 1) {
      return res.status(400).json({
        ok: false,
        msg: "La cantidad debe ser mayor a 0.",
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
      msg: "Equipo actualizado correctamente.",
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

const deleteEquipment = async (req, res = response) => {
  const equipmentId = req.params.id;

  try {
    let equipmentExists = await Equipment.findById(equipmentId);
    if (!equipmentExists) {
      return res.status(404).json({
        ok: false,
        msg: "El equipo no existe.",
      });
    }

    await Equipment.findByIdAndDelete(equipmentId);

    res.json({
      ok: true,
      msg: "Equipo eliminado correctamente.",
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