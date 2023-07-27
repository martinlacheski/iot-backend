const { Schema, model } = require("mongoose");

const TypeOfEnvironmentSchema = Schema({
    name: {
        type: String,
        required: true,
    },
});

// Verificar si el tipo de ambiente ya existe
TypeOfEnvironmentSchema.index({ name: 1 }, { unique: true });

module.exports = model("TypeOfEnvironment", TypeOfEnvironmentSchema);