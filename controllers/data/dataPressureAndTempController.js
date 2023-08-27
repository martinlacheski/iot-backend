const DataPressureAndTemp = require("../../models/data/DataPressureAndTemp");

async function getPressureAndTempData(fromDate, toDate, minutes) {
  try {
    // LISTADO DE REGISTROS
    const records = await DataPressureAndTemp.find({
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
      minPres = [],
      maxPres = [];
    for (const key in groupedData) {
      const group = groupedData[key];
      const minP = Math.min(...group.map((record) => record.pressure));
      const maxP = Math.max(...group.map((record) => record.pressure));
      labels.push(key);
      minPres.push(minP);
      maxPres.push(maxP);
    }

    return {
      ok: true,
      msg: "Datos obtenidos correctamente.",
      labels,
      minPres,
      maxPres,
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
  getPressureAndTempData,
};
