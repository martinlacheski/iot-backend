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
SensorSchema.index({ name: 1, board: 1 }, { unique: true });

// Devolver id en vez de _id
SensorSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Sensor', SensorSchema);