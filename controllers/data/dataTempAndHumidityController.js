const DataTempAndHumidity = require("../../models/data/DataTempAndHumidity");

async function getTempAndHumidityData(fromDate, toDate, minutes) {
  try {
    // LISTADO DE REGISTROS
    const records = await DataTempAndHumidity.find({
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
      minTemp = [],
      maxTemp = [],
      minHum = [],
      maxHum = [];
    for (const key in groupedData) {
      const group = groupedData[key];
      const minT = Math.min(...group.map((record) => record.temperature));
      const maxT = Math.max(...group.map((record) => record.temperature));
      const minH = Math.min(...group.map((record) => record.humidity));
      const maxH = Math.max(...group.map((record) => record.humidity));
      labels.push(key);
      minTemp.push(minT);
      maxTemp.push(maxT);
      minHum.push(minH);
      maxHum.push(maxH);
    }

    return {
      ok: true,
      msg: "Datos obtenidos correctamente.",
      labels,
      minTemp,
      maxTemp,
      minHum,
      maxHum,
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
  getTempAndHumidityData,
};
