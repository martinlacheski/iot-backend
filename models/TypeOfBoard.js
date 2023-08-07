const { Schema, model } = require("mongoose");

const TypeOfBoardSchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  specs: {
    type: String,
    required: true,
  },
});

// Verificar si la placa ya existe
TypeOfBoardSchema.index({ name: 1 }, { unique: true });

module.exports = model("TypeOfBoard", TypeOfBoardSchema);
