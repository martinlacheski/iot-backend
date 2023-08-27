const { Schema, model } = require("mongoose");

const OrganizationSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    webpage: {
      type: String,
      required: false,
    },
    logo: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Verificar si la organización ya existe en la ciudad
OrganizationSchema.index({ name: 1, city: 1 }, { unique: true });

module.exports = model("Organization", OrganizationSchema);
