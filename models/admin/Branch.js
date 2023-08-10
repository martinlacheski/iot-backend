const { Schema, model } = require("mongoose");

const BranchSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    city: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

BranchSchema.pre("find", function (next) {
  this.where({ isDeleted: false });
  next();
});

BranchSchema.pre("findOne", function (next) {
  this.where({ isDeleted: false });
  next();
});

BranchSchema.pre("findById", function (next) {
  this.where({ isDeleted: false });
  next();
});

BranchSchema.pre("findOneAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

BranchSchema.pre("findByIdAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

// Validar que el nombre de la sucursal sea único en la ciudad y organización
BranchSchema.index({ name: 1, city: 1, organization: 1 }, { unique: true });

module.exports = model("Branch", BranchSchema);
