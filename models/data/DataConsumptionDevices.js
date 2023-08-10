const { Schema, model } = require("mongoose");

const DataConsumptionDevices = Schema(
  {
    device: String,
    sensor: String,
    timestamp: String,

    // Data
    voltage: Number,
    current: Number,
    power: Number,
    energy: Number,
    frequency: Number,
    pf: Number,
    maxPower: Number,
  }
);

module.exports = model("DataConsumptionDevices", DataConsumptionDevices, "dataConsumptionDevices");