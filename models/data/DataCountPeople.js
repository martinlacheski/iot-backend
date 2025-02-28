const { Schema, model } = require("mongoose");

const DataCountPeople = Schema(
  {
    device: String,
    sensor: String,
    timestamp: Date,

    // Data
    count: Number,
  }
);

module.exports = model("DataCountPeople", DataCountPeople, "dataCountPeople");