const { Schema, model } = require("mongoose");

const DataAirQuality = Schema({
  device: String,
  sensor: String,
  timestamp: Date,

  // Data
  value: Number,
  ppm: Number,
});

module.exports = model("DataAirQuality", DataAirQuality, "dataAirQuality");
