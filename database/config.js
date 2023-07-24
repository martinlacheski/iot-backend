const mongoose = require('mongoose');

const connectDatabase = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Base de datos conectada.');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la base de datos.');
    }
}

module.exports = {
    connectDatabase,
}