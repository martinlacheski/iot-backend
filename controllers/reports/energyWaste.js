const { response } = require("express");
const DataConsumptionAC = require("../../models/data/DataConsumptionAC");
const DataConsumptionDevices = require("../../models/data/DataConsumptionDevices");
const DataConsumptionLighting = require("../../models/data/DataConsumptionLighting");
const DataMotionDetection = require("../../models/data/DataMotionDetection");
const getDateDiff = require("../../helpers/getDateDiff");
const calculateMinutes = require("../../helpers/calculateMinutes");

const getEnergyWasteData = async (req, res = response) => {
  try {
    // OBTENER FECHAS
    const { fromDate, toDate } = req.query;
    const { diff, diffInHours } = getDateDiff(fromDate, toDate);

    // OBTENEMOS LOS REGISTROS DE LA BASE DE DATOS
    const recordsAC = await DataConsumptionAC.find(
      { timestamp: { $gte: fromDate, $lte: toDate } },
      "timestamp sensor energy"
    );
    const recordsDevices = await DataConsumptionDevices.find(
      { timestamp: { $gte: fromDate, $lte: toDate } },
      "timestamp sensor energy"
    );
    const recordsLighting = await DataConsumptionLighting.find(
      { timestamp: { $gte: fromDate, $lte: toDate } },
      "timestamp sensor energy"
    );
    const recordsMotionDetection = await DataMotionDetection.find(
      { timestamp: { $gte: fromDate, $lte: toDate } },
      "timestamp sensor movementDetected"
    );

    let minutes = calculateMinutes(diffInHours);
    const msInterval = minutes * 60 * 1000;

    // AGRUPAR TODO
    const records = [
      ...recordsAC,
      ...recordsDevices,
      ...recordsLighting,
      ...recordsMotionDetection,
    ];

    // AGRUPAR POR FECHA
    const groupedData = {};
    records.forEach((record) => {
      const timestamp = new Date(record.timestamp).getTime();
      const key = Math.floor(timestamp / msInterval) * msInterval;
      const dateKey = new Date(key).toLocaleString();
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {
          ac: [],
          devices: [],
          lighting: [],
          motionDetection: [],
        };
      }
      if (record.sensor === "pzem-004t-AC") {
        groupedData[dateKey].ac.push(record);
      } else if (record.sensor === "pzem-004t-Devices") {
        groupedData[dateKey].devices.push(record);
      } else if (record.sensor === "pzem-004t-Lighting") {
        groupedData[dateKey].lighting.push(record);
      } else if (record.sensor === "pir") {
        groupedData[dateKey].motionDetection.push(record);
      }
    });

    // CALCULOS DE CONSUMO DE ENERGIA
    const labels = [],
      averagePowerAC = [],
      averagePowerDevices = [],
      averagePowerLighting = [],
      motionDetection = [];
    for (const groupKey in groupedData) {
      const group = groupedData[groupKey];
      labels.push(groupKey);
      averagePowerAC.push(
        +(
          group.ac.reduce((acc, cur) => acc + cur.energy, 0) / group.ac.length
        ).toFixed(2)
      );
      averagePowerDevices.push(
        +(
          group.devices.reduce((acc, cur) => acc + cur.energy, 0) /
          group.devices.length
        ).toFixed(2)
      );
      averagePowerLighting.push(
        +(
          group.lighting.reduce((acc, cur) => acc + cur.energy, 0) /
          group.lighting.length
        ).toFixed(2)
      );

      motionDetection.push(
        group.motionDetection.some((motion) => motion.movementDetected)
          ? "NO"
          : "SI"
      );
    }

    return res.json({
      ok: true,
      diff,
      labels,
      averagePowerAC,
      averagePowerDevices,
      averagePowerLighting,
      motionDetection,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

module.exports = {
  getEnergyWasteData,
};
