const { Schema, model } = require("mongoose");

const DataInternalLuminosity = Schema(
  {
    device: String,
    sensor: String,
    timestamp: Date,

    // Data
    level: Number,
  }
);

module.exports = model("DataInternalLuminosity", DataInternalLuminosity, "dataInternalLuminosity");