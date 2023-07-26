const {Schema, model} = require('mongoose');

const BoardSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    typeOfBoard: {
        type: Schema.Types.ObjectId,
        ref: 'TypeOfBoard',
        required: true,
    },
    environment: {
        type: Schema.Types.ObjectId,
        ref: 'Environment',
        required: true,
    },
});

// Verificar si la placa ya existe
BoardSchema.index({name: 1, environment: 1}, {unique: true});

// Devolver id en vez de _id
BoardSchema.method('toJSON', function () {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Board', BoardSchema);