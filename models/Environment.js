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
        type: Schema.Types.ObjectId,
        ref: 'Equipment',
    }],
    observations: {
        type: String,
    },
});

EnvironmentSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Environment', EnvironmentSchema);