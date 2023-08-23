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

const filterBetweenDates = async (req, res = response) => {
  try {
    const { fromDate, toDate } = req.query;

    const recordsDataConsumptionAC = await DataConsumptionAC.find({
      timestamp: {
        $gte: fromDate,
        $lte: toDate,
      },
    });

    const count = recordsDataConsumptionAC.length;

    return res.json({
      ok: true,
      msg: "DataConsumptionAC filter-between-dates consultado correctamente.",
      fromDate,
      toDate,
      count,
      recordsDataConsumptionAC,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

const resume = async (req, res = response) => {
  try {
    const records = await DataConsumptionAC.find({
      timestamp: {
        $gte: req.query.fromDate,
        $lte: req.query.toDate,
      },
    });

    // Cada 5 minutos
    const minutes = 5;
    const msInterval = minutes * 60 * 1000;
    const groupedData = {};
    const totalConsumedEnergy = +(
      records[records.length - 1].energy - records[0].energy
    ).toFixed(2); // [kWh]

    // Agrupar por fecha
    records.forEach((record) => {
      const timestamp = new Date(record.timestamp); // ! Importante: timestamp es un string (debemos guardarlo como Date en la BD)
      const key = Math.floor(timestamp.getTime() / msInterval) * msInterval;
      const groupKey = new Date(key).toLocaleString();

      if (!groupedData[groupKey]) {
        groupedData[groupKey] = [];
      }

      groupedData[groupKey].push(record);
    });

    const averagedData = [];
    for (const groupKey in groupedData) {
      const group = groupedData[groupKey];
      const averageVoltage = +(
        group.reduce((sum, record) => sum + record.voltage, 0) / group.length
      ).toFixed(2);
      const averageCurrent = +(
        group.reduce((sum, record) => sum + record.current, 0) / group.length
      ).toFixed(2);
      const averagePower = +(
        group.reduce((sum, record) => sum + record.power, 0) / group.length
      ).toFixed(2);
      const consumedEnergy = +(averagePower * (minutes / 60)).toFixed(2);
      const pf = +(
        group.reduce((sum, record) => sum + record.pf, 0) / group.length
      ).toFixed(2);

      averagedData.push({
        timestamp: groupKey,
        voltage: averageVoltage,
        current: averageCurrent,
        power: averagePower,
        consumedEnergy: consumedEnergy,
        pf: pf,
      });
    }

    return res.json({
      ok: true,
      msg: "DataConsumptionAC filter-between-dates consultado correctamente.",
      count: records.length,
      totalConsumedEnergy,
      averagedData,
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
  resume,
};
