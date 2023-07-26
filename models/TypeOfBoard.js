const { Schema, model } = require("mongoose");

const TypeOfBoardSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  specs: {
    type: Map,
    of: String,
  },
});

// Verificar si la placa ya existe
TypeOfBoardSchema.index({ name: 1 }, { unique: true });

// Devolver id en vez de _id
TypeOfBoardSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  object.specs = this.specs; // Agregar la propiedad 'specs' al objeto JSON
  return object;
});

module.exports = model("TypeOfBoard", TypeOfBoardSchema);
