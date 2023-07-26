const { Schema, model } = require("mongoose");

const CitySchema = Schema({
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
});

// Verificar si la ciudad ya existe en la provincia
CitySchema.index({ name: 1, province: 1 }, { unique: true });

module.exports = model("City", CitySchema);