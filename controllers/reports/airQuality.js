const { response } = require("express");
const getDateDiff = require("../../helpers/getDateDiff");
const calculateMinutes = require("../../helpers/calculateMinutes");
const { getMinMaxBetweenDatesMQ4 } = require("../data/dataNaturalGasesController");
const { getMinMaxBetweenDatesMQ135 } = require("../data/dataAirQualityController");
const { getMinMaxBetweenDatesMQ7 } = require("../data/dataCarbonMonoxideController");
const { getMinMaxBetweenDatesMQ2 } = require("../data/dataFlammableGasesController");

const getData = async (req, res = response) => {
  const { fromDate, toDate } = req.query;
  const { diff, diffInHours } = getDateDiff(fromDate, toDate);

  try {
    const minutes = calculateMinutes(diffInHours);

    const [mq2, mq4, mq7, mq135] = await Promise.all([
      getMinMaxBetweenDatesMQ2(fromDate, toDate, minutes),
      getMinMaxBetweenDatesMQ4(fromDate, toDate, minutes),
      getMinMaxBetweenDatesMQ7(fromDate, toDate, minutes),
      getMinMaxBetweenDatesMQ135(fromDate, toDate, minutes),
    ]);

    return res.json({
      ok: true,
      diff,
      mq2,
      mq4,
      mq7,
      mq135,
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
