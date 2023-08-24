const DataNaturalGases = require("../../models/data/DataNaturalGases");

async function getMinMaxBetweenDatesMQ4(fromDate, toDate, minutes) {
  try {
    // LISTADO DE REGISTROS
    const records = await DataNaturalGases.find({
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
      maxs = [];
    // const minMaxData = {};
    for (const key in groupedData) {
      const group = groupedData[key];
      const min = Math.min(...group.map((record) => record.ppm));
      const max = Math.max(...group.map((record) => record.ppm));
      labels.push(key);
      mins.push(min);
      maxs.push(max);
      // minMaxData[key] = { min, max };    // { "2021-06-01 00:00:00": { min: 0, max: 0 } }
    }

    return {
      ok: false,
      title: "Gases naturales - MQ4",
      labels,
      mins,
      maxs,
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
  getMinMaxBetweenDatesMQ4,
};
