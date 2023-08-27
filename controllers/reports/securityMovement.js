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
    const msInterval = minutes * 60 * 1000;

    const [recordsMovement, recordsCountPeople, recordsWindows, recordsDoors] =
      await Promise.all([
        DataMotionDetection.find({
          timestamp: { $gte: fromDate, $lte: toDate },
        }),
        DataCountPeople.find({ timestamp: { $gte: fromDate, $lte: toDate } }),
        DataWindowsStatus.find({ timestamp: { $gte: fromDate, $lte: toDate } }),
        DataDoorsStatus.find({ timestamp: { $gte: fromDate, $lte: toDate } }),
      ]);

    const records = [
      ...recordsMovement,
      ...recordsCountPeople,
      ...recordsWindows,
      ...recordsDoors,
    ];

    const groupedData = {};
    records.forEach((record) => {
      const timestamp = record.timestamp;
      const key = Math.floor(timestamp / msInterval) * msInterval;
      const dateKey = new Date(key).toLocaleString();
      const nextDateKey = new Date(key + msInterval).toLocaleString();
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {
          dateRange: {
            initial: dateKey,
            final: nextDateKey,
          },
          motionDetection: [],
          countPeople: [],
          windowsStatus: [],
          doorsStatus: [],
        };
      }

      if (record.sensor === "pir") {
        groupedData[dateKey].motionDetection.push(record);
      } else if (record.sensor === "irDetector") {
        groupedData[dateKey].countPeople.push(record);
      } else if (record.sensor === "magneticReed-Windows") {
        groupedData[dateKey].windowsStatus.push(record);
      } else if (record.sensor === "magneticReed-Doors") {
        groupedData[dateKey].doorsStatus.push(record);
      }
    });

    const keys = Object.keys(groupedData);

    keys.forEach((key) => {
      if (groupedData[key]) {
        const { motionDetection, countPeople, windowsStatus, doorsStatus } =
          groupedData[key];

        const motionDetectionCount = motionDetection.length;

        let countPeopleInitial = 0,
          countPeopleFinal = 0,
          countPeopleMin = 0,
          countPeopleMax = 0;

        if (countPeople && countPeople.length > 0) {
          countPeopleInitial = countPeople[0].count;
          countPeopleFinal = countPeople[countPeople.length - 1].count;
          countPeopleMin = Math.min(
            ...countPeople.map((record) => record.count)
          );
          countPeopleMax = Math.max(
            ...countPeople.map((record) => record.count)
          );
        }

        const windowsStatusWereOpen = windowsStatus.some(
          (record) => record.areOpen
        );
        const doorsStatusWereOpen = doorsStatus.some(
          (record) => record.areOpen
        );

        const showWarning = (countPeopleInitial === 0 || countPeopleFinal === 0) && (windowsStatusWereOpen || doorsStatusWereOpen);

        groupedData[key] = {
          ...groupedData[key],
          motionDetection: {
            wasDetected: motionDetectionCount > 0,
            count: motionDetectionCount,
          },
          countPeople: {
            initial: countPeopleInitial,
            final: countPeopleFinal,
            min: countPeopleMin,
            max: countPeopleMax,
          },
          windowsStatus: {
            wereOpen: windowsStatusWereOpen,
          },
          doorsStatus: {
            wereOpen: doorsStatusWereOpen,
          },
          warning: {
            showWarning,
          }
        };
      }
    });

    // ORDER BY DATE
    const orderedData = {};
    Object.keys(groupedData)
      .sort()
      .forEach((key) => {
        orderedData[key] = groupedData[key];
      });

    return res.json({
      ok: true,
      data: orderedData,
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
