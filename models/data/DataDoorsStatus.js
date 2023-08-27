const { Schema, model } = require("mongoose");

const DataDoorsStatus = Schema(
  {
    device: String,
    sensor: String,
    timestamp: Date,

    // Data
    areOpen: Boolean,
  }
);

module.exports = model("DataDoorsStatus", DataDoorsStatus, "dataDoorsStatus");