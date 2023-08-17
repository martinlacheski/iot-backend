const { response } = require("express");
const DataConsumptionAC = require("../../models/data/DataConsumptionAC");
const DataConsumptionDevices = require("../../models/data/DataConsumptionDevices");
const DataConsumptionLighting = require("../../models/data/DataConsumptionLighting");

const getEnergyConsumption = async (req, res = response) => {
  try {
    // OBTENEMOS LOS PARAMETROS DE LA URL
    // const environment = req.query.environment;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const diffInHours = +req.query.diffInHours;
    
    // Obtenemos días horas y minutos de diferencia
    const days = Math.floor(diffInHours / 24);
    const hours = Math.floor(diffInHours % 24);
    const mins = Math.floor((diffInHours * 60) % 60);
    const daysString = days > 0 ? `${days} días ` : "";
    const hoursString = hours > 0 ? `${hours} horas ` : "";
    const minsString = mins > 0 ? `${mins} minutos` : "";
    const diff = `${daysString}${hoursString}${minsString}`;

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
    let minutes = 0;
    if (0 < diffInHours && diffInHours <= 6) {
      // ENTRE 0 Y 6 HORAS
      minutes = 10;
    } else if (6 < diffInHours && diffInHours <= 12) {
      // ENTRE 6 Y 12 HORAS
      minutes = 15;
    } else if (12 < diffInHours && diffInHours <= 24) {
      // ENTRE 12 Y 24 HORAS
      minutes = 30;
    } else if (24 < diffInHours && diffInHours <= 48) {
      // ENTRE 24 Y 48 HORAS
      minutes = 60;
    } else if (48 < diffInHours && diffInHours <= 72) {
      // ENTRE 48 Y 72 HORAS
      minutes = 90;
    } else if (72 < diffInHours && diffInHours <= 168) {
      // ENTRE 72 Y 168 HORAS
      minutes = 120;
    } else if (168 < diffInHours && diffInHours <= 336) {
      // ENTRE 168 Y 336 HORAS
      minutes = 240;
    } else if (336 < diffInHours && diffInHours <= 504) {
      // ENTRE 336 Y 504 HORAS
      minutes = 480;
    } else if (504 < diffInHours && diffInHours <= 672) {
      // ENTRE 504 Y 672 HORAS
      minutes = 960;
    } else if (672 < diffInHours && diffInHours <= 730) {
      // ENTRE 672 Y 840 HORAS
      minutes = 120;
    }

    const msInterval = minutes * 60 * 1000;

    // CALCULOS DE CONSUMO DE ENERGIA
    const totalEnergyConsumptionAC = +(
      recordsAC[countAC - 1].energy - recordsAC[0].energy
    ).toFixed(2);
    const hourlyEnergyConsumptionAC = +(
      totalEnergyConsumptionAC / diffInHours
    ).toFixed(4);

    const totalEnergyConsumptionDevices = +(
      recordsDevices[countDevices - 1].energy - recordsDevices[0].energy
    ).toFixed(2);
    const hourlyEnergyConsumptionDevices = +(
      totalEnergyConsumptionDevices / diffInHours
    ).toFixed(4);

    const totalEnergyConsumptionLighting = +(
      recordsLighting[countLighting - 1].energy - recordsLighting[0].energy
    ).toFixed(2);
    const hourlyEnergyConsumptionLighting = +(
      totalEnergyConsumptionLighting / diffInHours
    ).toFixed(4);
    
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
      const averageVoltageAC = +(
        group.ac.reduce((sum, record) => sum + record.voltage, 0) /
        group.ac.length
      ).toFixed(2);
      const averageCurrentAC = +(
        group.ac.reduce((sum, record) => sum + record.current, 0) /
        group.ac.length
      ).toFixed(2);
      const averagePowerAC = +(
        group.ac.reduce((sum, record) => sum + record.power, 0) /
        group.ac.length
      ).toFixed(2);
      const pfAC = +(
        group.ac.reduce((sum, record) => sum + record.pf, 0) / group.ac.length
      ).toFixed(2);

      // DEVICES
      const averageVoltageDevices = +(
        group.devices.reduce((sum, record) => sum + record.voltage, 0) /
        group.devices.length
      ).toFixed(2);
      const averageCurrentDevices = +(
        group.devices.reduce((sum, record) => sum + record.current, 0) /
        group.devices.length
      ).toFixed(2);
      const averagePowerDevices = +(
        group.devices.reduce((sum, record) => sum + record.power, 0) /
        group.devices.length
      ).toFixed(2);
      const pfDevices = +(
        group.devices.reduce((sum, record) => sum + record.pf, 0) /
        group.devices.length
      ).toFixed(2);

      // LIGHTING
      const averageVoltageLighting = +(
        group.lighting.reduce((sum, record) => sum + record.voltage, 0) /
        group.lighting.length
      ).toFixed(2);
      const averageCurrentLighting = +(
        group.lighting.reduce((sum, record) => sum + record.current, 0) /
        group.lighting.length
      ).toFixed(2);
      const averagePowerLighting = +(
        group.lighting.reduce((sum, record) => sum + record.power, 0) /
        group.lighting.length
      ).toFixed(2);
      const pfLighting = +(
        group.lighting.reduce((sum, record) => sum + record.pf, 0) /
        group.lighting.length
      ).toFixed(2);

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
