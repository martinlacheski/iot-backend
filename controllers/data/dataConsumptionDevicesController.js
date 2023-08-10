const { response } = require("express");
const DataConsumptionDevices = require("../../models/data/DataConsumptionDevices");

// OBETENER TODOS LOS REGISTROS
const find = async (req, res = response) => {
  try {
    const records = await DataConsumptionDevices.find();
    const count = await DataConsumptionDevices.countDocuments();

    return res.json({
      ok: true,
      count,
      recordsDataConsumptionDevices: records,
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
    const recordsDataConsumptionDevices = await DataConsumptionDevices.find({
      timestamp: {
        $gte: req.query.fromDate,
        $lte: req.query.toDate,
      },
    });

    const count = recordsDataConsumptionDevices.length;

    return res.json({
      ok: true,
      count,
      recordsDataConsumptionDevices
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
