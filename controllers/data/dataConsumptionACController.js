const { response } = require("express");
const DataConsumptionAC = require("../../models/data/DataConsumptionAC");

/**
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de búsqueda es completada.
 */
const find = async (req, res = response) => {
  try {
    const records = await DataConsumptionAC.find();
    const count = await DataConsumptionAC.countDocuments();

    return res.json({
      ok: true,
      msg: "DataConsumptionAC consultado correctamente.",
      count,
      recordsDataConsumptionAC: records,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

const create = async (req, res = response) => {
  try {
    const register = new DataConsumptionAC(req.body);
    const result = await register.save();

    return res.json({
      ok: true,
      msg: "Registro creado correctamente.",
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

const filterBetweenDates = async (req, res = response) => {
  try {
    const recordsDataConsumptionAC = await DataConsumptionAC.find({
      timestamp: {
        $gte: req.query.fromDate,
        $lte: req.query.toDate,
      },
    });

    const count = recordsDataConsumptionAC.length;

    return res.json({
      ok: true,
      msg: "DataConsumptionAC filter-between-dates consultado correctamente.",
      count,
      recordsDataConsumptionAC
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
  create,
  filterBetweenDates,
};
