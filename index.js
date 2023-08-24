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
app.use('/api/auth', require('./routes/admin/authRoutes'));
app.use('/api/countries', require('./routes/admin/countryRoutes'));
app.use('/api/provinces', require('./routes/admin/provinceRoutes'));
app.use('/api/cities', require('./routes/admin/cityRoutes'));
app.use('/api/organization', require('./routes/admin/organizationRoutes'));
app.use('/api/branches', require('./routes/admin/branchRoutes'));
app.use('/api/types-of-equipments', require('./routes/admin/typeOfEquipmentRoutes'));
app.use('/api/equipments', require('./routes/admin/equipmentRoutes'));
app.use('/api/types-of-environments', require('./routes/admin/typeOfEnvironmentRoutes'));
app.use('/api/environments', require('./routes/admin/environmentsRoutes'));
app.use('/api/types-of-boards', require('./routes/admin/typeOfBoardRoutes'));
app.use('/api/boards', require('./routes/admin/boardRoutes'));
app.use('/api/types-of-sensors', require('./routes/admin/typeOfSensorRoutes'));
app.use('/api/sensors', require('./routes/admin/sensorRoutes'));

app.use('/api/data-consumption-ac', require('./routes/data/dataConsumptionACRoutes'));
app.use('/api/data-consumption-devices', require('./routes/data/dataConsumptionDevicesRoutes'));
app.use('/api/data-consumption-lighting', require('./routes/data/dataConsumptionLightingRoutes'));
app.use('/api/data-count-people', require('./routes/data/dataCountPeopleRoutes'));

// REPORTS
app.use('/api/reports/energy-consumption', require('./routes/reports/energyConsumptionRoutes'));

app.use('/api/reports/gases', require('./routes/reports/airQualityRoutes'));
app.use('/api/reports/energy-waste', require('./routes/reports/energyWasteRoutes'));

// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});