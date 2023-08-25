const { response } = require("express");
const getDateDiff = require("../../helpers/getDateDiff");
const calculateMinutes = require("../../helpers/calculateMinutes");
const {
  getPressureAndTempData,
} = require("../data/dataPressureAndTempController");
const {
  getTempAndHumidityData,
} = require("../data/dataTempAndHumidityController");
const { getAmbientNoiseData } = require("../data/dataAmbientNoiseController");
const {
  getInternalLuminosityData,
} = require("../data/dataInternalLuminosityController");
const {
  getExternalLuminosityData,
} = require("../data/dataExternalLuminosityController");

const getData = async (req, res = response) => {
  const { fromDate, toDate } = req.query;
  const { diff, diffInHours } = getDateDiff(fromDate, toDate);

  try {
    const minutes = calculateMinutes(diffInHours);

    const [
      pressureAndTempData,
      tempAndHumidityData,
      ambientNoiseData,
      internalLuminosityData,
      externalLuminosityData,
    ] = await Promise.all([
      getPressureAndTempData(fromDate, toDate, minutes),
      getTempAndHumidityData(fromDate, toDate, minutes),
      getAmbientNoiseData(fromDate, toDate, minutes),
      getInternalLuminosityData(fromDate, toDate, minutes),
      getExternalLuminosityData(fromDate, toDate, minutes),
    ]);

    return res.json({
      ok: true,
      diff,
      pressureAndTempData,
      tempAndHumidityData,
      ambientNoiseData,
      internalLuminosityData,
      externalLuminosityData,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

module.exports = {
  getData,
};
