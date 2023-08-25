const { Schema, model } = require("mongoose");

const DataAmbientNoise = Schema(
  {
    device: String,
    sensor: String,
    timestamp: Date,

    // Data
    level: Number,
  }
);

module.exports = model("DataAmbientNoise", DataAmbientNoise, "dataAmbientNoise");