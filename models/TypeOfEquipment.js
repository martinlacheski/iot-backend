const { Schema, model } = require("mongoose");

const TypeOfEquipmentSchema = Schema({
    name: {
        type: String,
        required: true,
    },
});

// Verificar si el tipo de equipo ya existe
TypeOfEquipmentSchema.index({ name: 1 }, { unique: true });

// Devolver id en vez de _id
TypeOfEquipmentSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model("TypeOfEquipment", TypeOfEquipmentSchema);