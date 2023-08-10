const { Schema, model } = require("mongoose");

const EquipmentSchema = Schema(
  {
    description: {
      type: String,
      required: true,
    },
    typeOfEquipment: {
      type: Schema.Types.ObjectId,
      ref: "TypeOfEquipment",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

EquipmentSchema.pre("find", function (next) {
  this.where({ isDeleted: false });
  next();
});

EquipmentSchema.pre("findOne", function (next) {
  this.where({ isDeleted: false });
  next();
});

EquipmentSchema.pre("findById", function (next) {
  this.where({ isDeleted: false });
  next();
});

EquipmentSchema.pre("findOneAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

EquipmentSchema.pre("findByIdAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

// Verificar si el equipo ya existe
EquipmentSchema.index({ description: 1, typeOfEquipment: 1 }, { unique: true });

module.exports = model("Equipment", EquipmentSchema, "equipments");
