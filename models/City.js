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

// Devolver id en vez de _id
CitySchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model("City", CitySchema);