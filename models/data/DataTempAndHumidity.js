const { Schema, model } = require("mongoose");

const DataTempAndHumidity = Schema(
  {
    device: String,
    sensor: String,
    timestamp: Date,

    // Data
    temperature: Number,
    humidity: Number,
  }
);

module.exports = model("DataTempAndHumidity", DataTempAndHumidity, "dataTempAndHumidity");