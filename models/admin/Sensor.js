const { Schema, model } = require('mongoose');

const SensorSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    minutesToStored: {
        type: Number,
        default: 5  // 5 minutos
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
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

SensorSchema.pre('find', function (next) {
    this.where({ isDeleted: false });
    next();
});

SensorSchema.pre('findOne', function (next) {
    this.where({ isDeleted: false });
    next();
});

SensorSchema.pre('findById', function (next) {
    this.where({ isDeleted: false });
    next();
});

SensorSchema.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false });
    next();
});

SensorSchema.pre('findByIdAndUpdate', function (next) {
    this.where({ isDeleted: false });
    next();
});

// Verificar si el sensor ya existe
SensorSchema.index({ name: 1, board: 1, typeOfSensor: 1 }, { unique: true });

module.exports = model('Sensor', SensorSchema);