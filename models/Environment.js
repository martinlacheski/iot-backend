const { Schema, model } = require('mongoose');

const EnvironmentSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    typeOfEnvironment: {
        type: Schema.Types.ObjectId,
        ref: 'TypeOfEnvironment',
        required: true,
    },
    branch: {
        type: Schema.Types.ObjectId,
        ref: 'Branch',
        required: true,
    },
    floor: {
        type: String,
    },
    room: {
        type: String,
    },
    capacity: {
        type: Number,
    },
    surface: {
        type: Number,
    },
    // List of equipments
    equipments: [{
        equipment: {
            type: Schema.Types.ObjectId,
            ref: 'Equipment',
            required: true,
        },
        quantity: {
            type: Number,
            default: 1, // You can set a default value for quantity if needed
        },
    }],
    observations: {
        type: String,
    },
});

// Verificar si el ambiente ya existe en la sucursal y tipo de ambiente
EnvironmentSchema.index({ name: 1, branch: 1, typeOfEnvironment: 1 }, { unique: true });

module.exports = model('Environment', EnvironmentSchema);