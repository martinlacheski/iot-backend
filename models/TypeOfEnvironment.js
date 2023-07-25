const { Schema, model } = require("mongoose");

const TypeOfEnvironmentSchema = Schema({
    name: {
        type: String,
        required: true,
    },
});

// Verificar si el tipo de ambiente ya existe
TypeOfEnvironmentSchema.index({ name: 1 }, { unique: true });

// Devolver id en vez de _id
TypeOfEnvironmentSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model("TypeOfEnvironment", TypeOfEnvironmentSchema);