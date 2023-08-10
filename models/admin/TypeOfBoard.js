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
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

TypeOfBoardSchema.pre("find", function (next) {
  this.where({ isDeleted: false });
  next();
});

TypeOfBoardSchema.pre("findOne", function (next) {
  this.where({ isDeleted: false });
  next();
});

TypeOfBoardSchema.pre("findById", function (next) {
  this.where({ isDeleted: false });
  next();
});

TypeOfBoardSchema.pre("findOneAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

TypeOfBoardSchema.pre("findByIdAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

// Verificar si la placa ya existe
TypeOfBoardSchema.index({ name: 1 }, { unique: true });

module.exports = model("TypeOfBoard", TypeOfBoardSchema);
