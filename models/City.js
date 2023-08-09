const { Schema, model } = require("mongoose");

const CitySchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    province: {
      type: Schema.Types.ObjectId,
      ref: "Province",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

CitySchema.pre("find", function (next) {
  this.where({ isDeleted: false });
  next();
});

CitySchema.pre("findOne", function (next) {
  this.where({ isDeleted: false });
  next();
});

CitySchema.pre("findById", function (next) {
  this.where({ isDeleted: false });
  next();
});

CitySchema.pre("findOneAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

CitySchema.pre("findByIdAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

// Verificar si la ciudad ya existe en la provincia
CitySchema.index({ name: 1, province: 1 }, { unique: true });

module.exports = model("City", CitySchema);
