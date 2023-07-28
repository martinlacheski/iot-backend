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

module.exports = model("TypeOfBoard", TypeOfBoardSchema);
