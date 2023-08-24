const { Schema, model } = require("mongoose");

const DataFlammableGases = Schema({
  device: String,
  sensor: String,
  timestamp: Date,

  // Data
  value: Number,
  ppm: Number,
});

module.exports = model("DataFlammableGases", DataFlammableGases, "dataFlammableGases");
