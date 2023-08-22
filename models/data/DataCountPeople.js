const { Schema, model } = require("mongoose");

const DataCountPeople = Schema(
  {
    device: String,
    sensor: String,
    timestamp: String,

    // Data
    count: Number,
  }
);

module.exports = model("DataCountPeople", DataCountPeople, "dataCountPeople");