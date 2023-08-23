const { Schema, model } = require("mongoose");

const DataConsumptionLighting = Schema(
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

module.exports = model("DataConsumptionLighting", DataConsumptionLighting, "dataConsumptionLighting");