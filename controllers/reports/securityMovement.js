const { response } = require("express");
const getDateDiff = require("../../helpers/getDateDiff");
const calculateMinutes = require("../../helpers/calculateMinutes");
const DataMotionDetection = require("../../models/data/DataMotionDetection");
const DataCountPeople = require("../../models/data/DataCountPeople");
const DataWindowsStatus = require("../../models/data/DataWindowsStatus");
const DataDoorsStatus = require("../../models/data/DataDoorsStatus");

const getData = async (req, res = response) => {
  const { fromDate, toDate } = req.query;
  const { diff, diffInHours } = getDateDiff(fromDate, toDate);

  try {
    const minutes = calculateMinutes(diffInHours);

    const [recordsMovement, recordsCountPeople, recordsWindows, recordsDoors] =
      await Promise.all([
        DataMotionDetection.find({ timestamp: { $gte: fromDate, $lte: toDate } }),
        DataCountPeople.find({ timestamp: { $gte: fromDate, $lte: toDate } }),
        DataWindowsStatus.find({ timestamp: { $gte: fromDate, $lte: toDate } }),
        DataDoorsStatus.find({ timestamp: { $gte: fromDate, $lte: toDate } }),
      ]);

    return res.json({
      ok: true,
      diff,
      recordsMovement,
      recordsCountPeople,
      recordsWindows,
      recordsDoors,
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
