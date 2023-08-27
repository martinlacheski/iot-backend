const { Schema, model } = require("mongoose");

const DataWindowsStatus = Schema(
  {
    device: String,
    sensor: String,
    timestamp: Date,

    // Data
    areOpen: Boolean,
  }
);

module.exports = model("DataWindowsStatus", DataWindowsStatus, "dataWindowsStatus");