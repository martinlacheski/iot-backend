const { Schema, model } = require("mongoose");

const ProvinceSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
});

// Verificar si la provincia ya existe en el país
ProvinceSchema.index({ name: 1, country: 1 }, { unique: true });

// Devolver id en vez de _id
ProvinceSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("Province", ProvinceSchema);
