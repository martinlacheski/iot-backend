const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("find", function (next) {
  this.where({ isDeleted: false });
  next();
});

UserSchema.pre("findOne", function (next) {
  this.where({ isDeleted: false });
  next();
});

UserSchema.pre("findById", function (next) {
  this.where({ isDeleted: false });
  next();
});

UserSchema.pre("findOneAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

module.exports = model("User", UserSchema);