const { Schema, model } = require("mongoose");

const TypeOfEquipmentSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,  
        default: false,
    },
}, { timestamps: true });

TypeOfEquipmentSchema.pre("find", function (next) {
    this.where({ isDeleted: false });
    next();
});

TypeOfEquipmentSchema.pre("findOne", function (next) {
    this.where({ isDeleted: false });
    next();
});

TypeOfEquipmentSchema.pre("findById", function (next) {
    this.where({ isDeleted: false });
    next();
});

TypeOfEquipmentSchema.pre("findOneAndUpdate", function (next) {
    this.where({ isDeleted: false });
    next();
});

TypeOfEquipmentSchema.pre("findByIdAndUpdate", function (next) {
    this.where({ isDeleted: false });
    next();
});

// Verificar si el tipo de equipo ya existe
TypeOfEquipmentSchema.index({ name: 1 }, { unique: true });

module.exports = model("TypeOfEquipment", TypeOfEquipmentSchema);