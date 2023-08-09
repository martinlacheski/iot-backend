const { Schema, model } = require("mongoose");

const BoardSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    typeOfBoard: {
      type: Schema.Types.ObjectId,
      ref: "TypeOfBoard",
      required: true,
    },
    environment: {
      type: Schema.Types.ObjectId,
      ref: "Environment",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

BoardSchema.pre("find", function (next) {
  this.where({ isDeleted: false });
  next();
});

BoardSchema.pre("findOne", function (next) {
  this.where({ isDeleted: false });
  next();
});

BoardSchema.pre("findById", function (next) {
  this.where({ isDeleted: false });
  next();
});

BoardSchema.pre("findOneAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

BoardSchema.pre("findByIdAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

// Verificar si la placa ya existe
BoardSchema.index(
  { name: 1, typeOfBoard: 1, environment: 1 },
  { unique: true }
);

module.exports = model("Board", BoardSchema);
