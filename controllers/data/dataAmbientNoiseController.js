const DataAmbientNoise = require("../../models/data/DataAmbientNoise");

async function getAmbientNoiseData(fromDate, toDate, minutes) {
  try {
    // LISTADO DE REGISTROS
    const records = await DataAmbientNoise.find({
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
      averageNoise = [];

    for (const key in groupedData) {
      const group = groupedData[key];
      const average = +((group.reduce((acc, curr) => acc + curr.level, 0) / group.length).toFixed(2));
      labels.push(key);
      averageNoise.push(average);
    }

    return {
      ok: true,
      msg: "Datos obtenidos correctamente.",
      labels,
      averageNoise,
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
  getAmbientNoiseData,
};
