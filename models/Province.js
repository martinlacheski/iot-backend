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
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

ProvinceSchema.pre("find", function (next) {
  this.where({ isDeleted: false });
  next();
});

ProvinceSchema.pre("findOne", function (next) {
  this.where({ isDeleted: false });
  next();
});

ProvinceSchema.pre("findById", function (next) {
  this.where({ isDeleted: false });
  next();
});

ProvinceSchema.pre("findOneAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

ProvinceSchema.pre("findByIdAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

// Verificar si la provincia ya existe en el país
ProvinceSchema.index({ name: 1, country: 1 }, { unique: true });

module.exports = model("Province", ProvinceSchema);