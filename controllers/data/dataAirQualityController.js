const DataAirQuality = require("../../models/data/DataAirQuality");

async function getMinMaxBetweenDatesMQ135(fromDate, toDate, minutes) {
  try {
    // LISTADO DE REGISTROS
    const records = await DataAirQuality.find({
      timestamp: {
        $gte: fromDate,
        $lte: toDate,
      },
    });

    // VARIABLES PARA CALCULOS DE AGRUPACION
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

    // OBTENER VALORES MINIMOS Y MAXIMOS DE CADA GRUPO
    const labels = [],
      mins = [],
      maxs = [],
      limits = [];
    // const minMaxData = {};
    for (const key in groupedData) {
      const group = groupedData[key];
      const min = Math.min(...group.map((record) => record.ppm));
      const max = Math.max(...group.map((record) => record.ppm));
      labels.push(key);
      mins.push(min);
      maxs.push(max);
      limits.push(1500);
    }

    return {
      ok: false,
      title: "Calidad del aire - MQ135",
      labels,
      mins,
      maxs,
      limits,
      maxLimit: 2500,
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
  getMinMaxBetweenDatesMQ135,
};
