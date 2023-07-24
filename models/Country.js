const { Schema, model } = require("mongoose");

const CountrySchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
});

// Devolver id en vez de _id
CountrySchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("Country", CountrySchema);