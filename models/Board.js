const {Schema, model} = require('mongoose');

const BoardSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true,
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
BoardSchema.index({name: 1, typeOfBoard: 1, environment: 1}, {unique: true});

module.exports = model('Board', BoardSchema);