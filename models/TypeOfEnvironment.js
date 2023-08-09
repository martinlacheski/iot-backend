const { Schema, model } = require("mongoose");

const TypeOfEnvironmentSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

TypeOfEnvironmentSchema.pre("find", function (next) {
  this.where({ isDeleted: false });
  next();
});

TypeOfEnvironmentSchema.pre("findOne", function (next) {
  this.where({ isDeleted: false });
  next();
});

TypeOfEnvironmentSchema.pre("findById", function (next) {
  this.where({ isDeleted: false });
  next();
});

TypeOfEnvironmentSchema.pre("findOneAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

TypeOfEnvironmentSchema.pre("findByIdAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

// Verificar si el tipo de ambiente ya existe
TypeOfEnvironmentSchema.index({ name: 1 }, { unique: true });

module.exports = model("TypeOfEnvironment", TypeOfEnvironmentSchema);
