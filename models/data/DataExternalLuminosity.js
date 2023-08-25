const { Schema, model } = require("mongoose");

const DataExternalLuminosity = Schema(
  {
    device: String,
    sensor: String,
    timestamp: Date,

    // Data
    level: Number,
  }
);

module.exports = model("DataExternalLuminosity", DataExternalLuminosity, "dataExternalLuminosity");