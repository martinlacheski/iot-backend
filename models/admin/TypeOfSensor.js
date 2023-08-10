const { Schema, model } = require('mongoose');

const TypeOfSensorSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    specs: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

TypeOfSensorSchema.pre('find', function (next) {
    this.where({ isDeleted: false });
    next();
});

TypeOfSensorSchema.pre('findOne', function (next) {
    this.where({ isDeleted: false });
    next();
});

TypeOfSensorSchema.pre('findById', function (next) {
    this.where({ isDeleted: false });
    next();
});

TypeOfSensorSchema.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false });
    next();
});

TypeOfSensorSchema.pre('findByIdAndUpdate', function (next) {
    this.where({ isDeleted: false });
    next();
});

TypeOfSensorSchema.index({ name: 1 }, { unique: true });

module.exports = model('TypeOfSensor', TypeOfSensorSchema);