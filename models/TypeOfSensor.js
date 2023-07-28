const { Schema, model } = require('mongoose');

const TypeOfSensorSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    specs: {
        type: Map,
        of: String
    }
});

TypeOfSensorSchema.index({ name: 1 }, { unique: true });

module.exports = model('TypeOfSensor', TypeOfSensorSchema);