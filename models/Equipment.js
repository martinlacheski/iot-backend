const { Schema, model } = require("mongoose");

const EquipmentSchema = Schema({
    description: {
        type: String,
        required: true,
    },
    typeOfEquipment: {
        type: Schema.Types.ObjectId,
        ref: "TypeOfEquipment",
        required: true,
    },
});

// Verificar si el equipo ya existe
EquipmentSchema.index({ description: 1, typeOfEquipment: 1 }, { unique: true });

module.exports = model("Equipment", EquipmentSchema, "equipments");