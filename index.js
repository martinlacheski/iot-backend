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
app.use('/api/countries', require('./routes/countryRoutes'));
app.use('/api/provinces', require('./routes/provinceRoutes'));
app.use('/api/cities', require('./routes/cityRoutes'));
app.use('/api/organizations', require('./routes/organizationsRoutes'));
app.use('/api/branches', require('./routes/branchesRoutes'));
app.use('/api/types-of-equipments', require('./routes/typesOfEquipmentsRoutes'));
app.use('/api/equipments', require('./routes/equipmentsRoutes'));
app.use('/api/types-of-environments', require('./routes/typesOfEnvironmentsRoutes'));
app.use('/api/environments', require('./routes/environmentsRoutes'));
app.use('/api/types-of-boards', require('./routes/typesOfBoardsRoutes'));
app.use('/api/boards', require('./routes/boardsRoutes'));
app.use('/api/types-of-sensors', require('./routes/typesOfSensorRoutes'));
app.use('/api/sensors', require('./routes/sensorsRoutes'));

// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});