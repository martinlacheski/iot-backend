const { Schema, model } = require("mongoose");

const RoleSchema = Schema(
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

RoleSchema.pre("find", function (next) {
  this.where({ isDeleted: false });
  next();
});

RoleSchema.pre("findOne", function (next) {
  this.where({ isDeleted: false });
  next();
});

RoleSchema.pre("findById", function (next) {
  this.where({ isDeleted: false });
  next();
});

RoleSchema.pre("findOneAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

RoleSchema.pre("findByIdAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

module.exports = model("Role", RoleSchema);
