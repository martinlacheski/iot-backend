const { response } = require("express");
const DataConsumptionLighting = require("../../models/data/DataConsumptionLighting");

// OBETENER TODOS LOS REGISTROS
const find = async (req, res = response) => {
  try {
    const records = await DataConsumptionLighting.find();
    const count = await DataConsumptionLighting.countDocuments();

    return res.json({
      ok: true,
      count,
      recordsDataConsumptionLighting: records,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

// FILTRA ENTRE FECHAS
const filterBetweenDates = async (req, res = response) => {
  try {
    const recordsDataConsumptionLighting = await DataConsumptionLighting.find({
      timestamp: {
        $gte: req.query.fromDate,
        $lte: req.query.toDate,
      },
    });

    const count = recordsDataConsumptionLighting.length;

    return res.json({
      ok: true,
      count,
      recordsDataConsumptionLighting
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

module.exports = {
  find,
  filterBetweenDates,
};
