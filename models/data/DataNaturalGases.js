const { Schema, model } = require("mongoose");

const DataNaturalGases = Schema({
  device: String,
  sensor: String,
  timestamp: Date,

  // Data
  value: Number,
  ppm: Number,
});

module.exports = model("DataNaturalGases", DataNaturalGases, "dataNaturalGases");
