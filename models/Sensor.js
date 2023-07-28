const { Schema, model } = require('mongoose');

const SensorSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    typeOfSensor: {
        type: Schema.Types.ObjectId,
        ref: 'TypeOfSensor',
        required: true,
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
});

// Verificar si el sensor ya existe
SensorSchema.index({ name: 1, board: 1, typeOfSensor: 1 }, { unique: true });

module.exports = model('Sensor', SensorSchema);