const DataInternalLuminosity = require("../../models/data/DataInternalLuminosity");

async function getInternalLuminosityData(fromDate, toDate, minutes) {
  try {
    // LISTADO DE REGISTROS
    const records = await DataInternalLuminosity.find({
      timestamp: {
        $gte: fromDate,
        $lte: toDate,
      },
    });

    const msInterval = minutes * 60 * 1000;

    // AGRUPAR
    const groupedData = {};
    records.forEach((record) => {
      const timestamp = record.timestamp.getTime();
      const key = Math.floor(timestamp / msInterval) * msInterval;
      const dateKey = new Date(key).toLocaleString();

      if (!groupedData[dateKey]) {
        groupedData[dateKey] = [];
      }
      groupedData[dateKey].push(record);
    });

    const labels = [],
      minLevel = [],
      maxLevel = [];
    for (const key in groupedData) {
      const group = groupedData[key];
      const minP = Math.min(...group.map((record) => record.level));
      const maxP = Math.max(...group.map((record) => record.level));
      labels.push(key);
      minLevel.push(minP);
      maxLevel.push(maxP);
    }

    return {
      ok: true,
      msg: "Datos obtenidos correctamente.",
      labels,
      minLevel,
      maxLevel,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      msg: "Error interno del servidor.",
    };
  }
}

module.exports = {
  getInternalLuminosityData,
};
