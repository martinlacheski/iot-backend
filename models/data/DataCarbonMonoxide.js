const { Schema, model } = require("mongoose");

const DataCarbonMonoxide = Schema({
  device: String,
  sensor: String,
  timestamp: Date,

  // Data
  value: Number,
  ppm: Number,
});

module.exports = model("DataCarbonMonoxide", DataCarbonMonoxide, "dataCarbonMonoxide");
