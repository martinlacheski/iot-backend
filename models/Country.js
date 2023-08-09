const { Schema, model } = require("mongoose");

const CountrySchema = Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

CountrySchema.pre("find", function (next) {
  this.where({ isDeleted: false });
  next();
});

CountrySchema.pre("findOne", function (next) {
  this.where({ isDeleted: false });
  next();
});

CountrySchema.pre("findById", function (next) {
  this.where({ isDeleted: false });
  next();
});

CountrySchema.pre("findOneAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

CountrySchema.pre("findByIdAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

module.exports = model("Country", CountrySchema);
