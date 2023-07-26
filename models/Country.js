const { Schema, model } = require("mongoose");

const CountrySchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
});

module.exports = model("Country", CountrySchema);