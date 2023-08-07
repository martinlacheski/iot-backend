const express = require('express');
const { connectDatabase } = require('./database/config');
const cors = require('cors');
require('dotenv').config();

console.log("Proyecto de servidor de NodeJS iniciado.")

// Creación del servidor de express
const app = express();

// Conexión a la base de datos
connectDatabase();

// CORS
app.use(cors());

// Middleware para lectura y parseo del body (JSON)
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/countries', require('./routes/countryRoutes'));
app.use('/api/provinces', require('./routes/provinceRoutes'));
app.use('/api/cities', require('./routes/cityRoutes'));
app.use('/api/organization', require('./routes/organizationRoutes'));
app.use('/api/branches', require('./routes/branchRoutes'));
app.use('/api/types-of-equipments', require('./routes/typeOfEquipmentRoutes'));
app.use('/api/equipments', require('./routes/equipmentRoutes'));
app.use('/api/types-of-environments', require('./routes/typeOfEnvironmentRoutes'));
app.use('/api/environments', require('./routes/environmentsRoutes'));
app.use('/api/types-of-boards', require('./routes/typeOfBoardRoutes'));
app.use('/api/boards', require('./routes/boardRoutes'));
app.use('/api/types-of-sensors', require('./routes/typeOfSensorRoutes'));
app.use('/api/sensors', require('./routes/sensorRoutes'));

// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});