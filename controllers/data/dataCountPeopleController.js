const { response } = require("express");
const DataCountPeople = require("../../models/data/DataCountPeople");

/**
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de búsqueda es completada.
 */
const getLastValue = async (req, res = response) => {
  try {
    const lastValue = await DataCountPeople.findOne()
      .sort({ _id: -1 })
      .limit(1)
      .select("count");
    return res.status(200).json({
      ok: true,
      count: lastValue,
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
  getLastValue,
};
