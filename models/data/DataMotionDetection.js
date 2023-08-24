const { Schema, model } = require("mongoose");

const DataMotionDetection = Schema(
  {
    device: String,
    sensor: String,
    timestamp: Date,

    // Data
    movementDetected: Boolean,
  }
);

module.exports = model("DataMotionDetection", DataMotionDetection, "dataMotionDetection");