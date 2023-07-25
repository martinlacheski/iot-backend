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
    quantity: {
        type: Number,
        min: 1,
        required: true,
    },
    observations: {
        type: String,
    },
});

// Verificar si el equipo ya existe
EquipmentSchema.index({ description: 1, typeOfEquipment: 1 }, { unique: true });

// Devolver id en vez de _id
EquipmentSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model("Equipment", EquipmentSchema, "equipments");