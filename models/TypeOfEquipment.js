const { Schema, model } = require("mongoose");

const TypeOfEquipmentSchema = Schema({
    name: {
        type: String,
        required: true,
    },
});

// Verificar si el tipo de equipo ya existe
TypeOfEquipmentSchema.index({ name: 1 }, { unique: true });

module.exports = model("TypeOfEquipment", TypeOfEquipmentSchema);