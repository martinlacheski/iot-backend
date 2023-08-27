const { Schema, model } = require("mongoose");

const DataPressureAndTemp = Schema(
  {
    device: String,
    sensor: String,
    timestamp: Date,

    // Data
    pressure: Number,
    temperature: Number,
  }
);

module.exports = model("DataPressureAndTemp", DataPressureAndTemp, "dataPressureAndTemp");