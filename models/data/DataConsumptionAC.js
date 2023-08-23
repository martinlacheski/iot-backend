const { Schema, model } = require("mongoose");

const DataConsumptionAC = Schema(
  {
    device: String,
    sensor: String,
    timestamp: Date,

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

module.exports = model("DataConsumptionAC", DataConsumptionAC, "dataConsumptionAC");