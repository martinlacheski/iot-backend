const express = require('express');
const { connectDatabase } = require('./database/config');
require('dotenv').config();

console.log("Proyecto de servidor de NodeJS iniciado.")

// Creación del servidor de express
const app = express();

// Conexión a la base de datos
connectDatabase();

// Middleware para lectura y parseo del body (JSON)
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/countries', require('./routes/countriesRoutes'));
app.use('/api/provinces', require('./routes/provincesRoutes'));

// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});