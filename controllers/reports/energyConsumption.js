const { response } = require("express");
const DataConsumptionAC = require("../../models/data/DataConsumptionAC");
const DataConsumptionDevices = require("../../models/data/DataConsumptionDevices");
const DataConsumptionLighting = require("../../models/data/DataConsumptionLighting");
const getDateDiff = require("../../helpers/getDateDiff");
const calculateMinutes = require("../../helpers/calculateMinutes");

const getEnergyConsumption = async (req, res = response) => {
  try {
    // OBTENER FECHAS
    const { fromDate, toDate } = req.query;
    const { diff, diffInHours } = getDateDiff(fromDate, toDate);

    // OBTENEMOS LOS REGISTROS DE LA BASE DE DATOS
    const recordsAC = await DataConsumptionAC.find({
      timestamp: {
        $gte: fromDate,
        $lte: toDate,
      },
    });

    const recordsDevices = await DataConsumptionDevices.find({
      timestamp: {
        $gte: fromDate,
        $lte: toDate,
      },
    });

    const recordsLighting = await DataConsumptionLighting.find({
      timestamp: {
        $gte: fromDate,
        $lte: toDate,
      },
    });

    // CANTIDAD DE REGISTROS
    const countAC = recordsAC.length;
    const countDevices = recordsDevices.length;
    const countLighting = recordsLighting.length;

    // VARIABLES PARA CALCULOS
    let minutes = calculateMinutes(diffInHours);

    const msInterval = minutes * 60 * 1000;

    // CALCULOS DE CONSUMO DE ENERGIA
    let totalEnergyConsumptionAC = 0,
      hourlyEnergyConsumptionAC = 0;
    if (countAC > 0) {
      totalEnergyConsumptionAC = +(
        recordsAC[countAC - 1].energy - recordsAC[0].energy
      ).toFixed(2);
      hourlyEnergyConsumptionAC = +(
        totalEnergyConsumptionAC / diffInHours
      ).toFixed(4);
    }

    let totalEnergyConsumptionDevices = 0,
      hourlyEnergyConsumptionDevices = 0;
    if (countDevices > 0) {
      totalEnergyConsumptionDevices = +(
        recordsDevices[countDevices - 1].energy - recordsDevices[0].energy
      ).toFixed(2);
      hourlyEnergyConsumptionDevices = +(
        totalEnergyConsumptionDevices / diffInHours
      ).toFixed(4);
    }

    let totalEnergyConsumptionLighting = 0,
      hourlyEnergyConsumptionLighting = 0;
    if (countLighting > 0) {
      totalEnergyConsumptionLighting = +(
        recordsLighting[countLighting - 1].energy - recordsLighting[0].energy
      ).toFixed(2);
      hourlyEnergyConsumptionLighting = +(
        totalEnergyConsumptionLighting / diffInHours
      ).toFixed(4);
    }

    // UNIFICAR LOS REGISTROS DE LOS DISTINTOS SENSORES
    const records = [...recordsAC, ...recordsDevices, ...recordsLighting];

    // AGRUPAR POR FECHA LOS REGISTROS DE LOS DISTINTOS SENSORES
    const groupedData = {};
    records.forEach((record) => {
      const timestamp = new Date(record.timestamp).getTime();
      const key = Math.floor(timestamp / msInterval) * msInterval;
      const dateKey = new Date(key).toLocaleString();
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {
          ac: [],
          devices: [],
          lighting: [],
        };
      }
      if (record.sensor === "pzem-004t-AC") {
        groupedData[dateKey].ac.push(record);
      } else if (record.sensor === "pzem-004t-Devices") {
        groupedData[dateKey].devices.push(record);
      } else if (record.sensor === "pzem-004t-Lighting") {
        groupedData[dateKey].lighting.push(record);
      }
    });

    // CALCULAR LOS PROMEDIOS DE LOS REGISTROS AGRUPADOS
    const averagedVoltageDataAC = [];
    const averagedVoltageDataDevices = [];
    const averagedVoltageDataLighting = [];

    const averagedCurrentDataAC = [];
    const averagedCurrentDataDevices = [];
    const averagedCurrentDataLighting = [];

    const averagedPowerDataAC = [];
    const averagedPowerDataDevices = [];
    const averagedPowerDataLighting = [];

    const averagedPfDataAC = [];
    const averagedPfDataDevices = [];
    const averagedPfDataLighting = [];

    for (const groupKey in groupedData) {
      const group = groupedData[groupKey];

      // AC
      let averageVoltageAC = 0,
        averageCurrentAC = 0,
        averagePowerAC = 0,
        pfAC = 0;
      if (group.ac.length > 0) {
        averageVoltageAC = +(
          group.ac.reduce((sum, record) => sum + record.voltage, 0) /
          group.ac.length
        ).toFixed(2);
        averageCurrentAC = +(
          group.ac.reduce((sum, record) => sum + record.current, 0) /
          group.ac.length
        ).toFixed(2);
        averagePowerAC = +(
          group.ac.reduce((sum, record) => sum + record.power, 0) /
          group.ac.length
        ).toFixed(2);
        pfAC = +(
          group.ac.reduce((sum, record) => sum + record.pf, 0) / group.ac.length
        ).toFixed(2);
      }

      // DEVICES
      let averageVoltageDevices = 0,
        averageCurrentDevices = 0,
        averagePowerDevices = 0,
        pfDevices = 0;
      if (group.devices.length > 0) {
        averageVoltageDevices = +(
          group.devices.reduce((sum, record) => sum + record.voltage, 0) /
          group.devices.length
        ).toFixed(2);
        averageCurrentDevices = +(
          group.devices.reduce((sum, record) => sum + record.current, 0) /
          group.devices.length
        ).toFixed(2);
        averagePowerDevices = +(
          group.devices.reduce((sum, record) => sum + record.power, 0) /
          group.devices.length
        ).toFixed(2);
        pfDevices = +(
          group.devices.reduce((sum, record) => sum + record.pf, 0) /
          group.devices.length
        ).toFixed(2);
      }

      // LIGHTING
      let averageVoltageLighting = 0,
        averageCurrentLighting = 0,
        averagePowerLighting = 0,
        pfLighting = 0;
      if (group.lighting.length > 0) {
        averageVoltageLighting = +(
          group.lighting.reduce((sum, record) => sum + record.voltage, 0) /
          group.lighting.length
        ).toFixed(2);
        averageCurrentLighting = +(
          group.lighting.reduce((sum, record) => sum + record.current, 0) /
          group.lighting.length
        ).toFixed(2);
        averagePowerLighting = +(
          group.lighting.reduce((sum, record) => sum + record.power, 0) /
          group.lighting.length
        ).toFixed(2);
        pfLighting = +(
          group.lighting.reduce((sum, record) => sum + record.pf, 0) /
          group.lighting.length
        ).toFixed(2);
      }

      // GUARDAR LOS DATOS PROMEDIADOS DE CADA GRUPO
      averagedVoltageDataAC.push(averageVoltageAC);
      averagedVoltageDataDevices.push(averageVoltageDevices);
      averagedVoltageDataLighting.push(averageVoltageLighting);

      averagedCurrentDataAC.push(averageCurrentAC);
      averagedCurrentDataDevices.push(averageCurrentDevices);
      averagedCurrentDataLighting.push(averageCurrentLighting);

      averagedPowerDataAC.push(averagePowerAC);
      averagedPowerDataDevices.push(averagePowerDevices);
      averagedPowerDataLighting.push(averagePowerLighting);

      averagedPfDataAC.push(pfAC);
      averagedPfDataDevices.push(pfDevices);
      averagedPfDataLighting.push(pfLighting);
    }

    // OBTENER LAS KEYS DE LOS GRUPOS
    const labels = Object.keys(groupedData);

    // RESPUESTA
    return res.json({
      ok: true,
      labels,
      totalEnergyConsumptionAC,
      totalEnergyConsumptionDevices,
      totalEnergyConsumptionLighting,
      diffInHours,
      diff,
      hourlyEnergyConsumptionAC,
      hourlyEnergyConsumptionDevices,
      hourlyEnergyConsumptionLighting,
      averagedVoltageDataAC,
      averagedVoltageDataDevices,
      averagedVoltageDataLighting,
      averagedCurrentDataAC,
      averagedCurrentDataDevices,
      averagedCurrentDataLighting,
      averagedPowerDataAC,
      averagedPowerDataDevices,
      averagedPowerDataLighting,
      averagedPfDataAC,
      averagedPfDataDevices,
      averagedPfDataLighting,
    });
  } catch (error) {
    // RESPUESTA ERROR
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

module.exports = {
  getEnergyConsumption,
};
