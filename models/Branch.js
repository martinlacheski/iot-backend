const {Schema, model} = require('mongoose');

const BranchSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: 'City',
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
});

// Verificar si la sucursal ya existe en la ciudad
BranchSchema.index({name: 1, city: 1}, {unique: true});

// Verificar si la sucursal ya existe en la organización
BranchSchema.index({name: 1, organization: 1}, {unique: true});

// Devolver id en vez de _id
BranchSchema.method('toJSON', function () {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Branch', BranchSchema);