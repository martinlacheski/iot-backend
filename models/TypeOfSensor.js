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

// Devolver id en vez de _id
TypeOfSensorSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    object.specs = this.specs;
    return object;
});

module.exports = model('TypeOfSensor', TypeOfSensorSchema);