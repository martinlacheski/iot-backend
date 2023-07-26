/* RUTAS DE SENSORES
 * Ruta: host + /api/sensors
 */

const { Router } = require('express');
const { getSensors, createSensor, updateSensor, deleteSensor } = require('../controllers/sensorsController');
const { validateJWT } = require('../middlewares/validateJWT');
const { validateFields } = require('../middlewares/validateFields');
const { check } = require('express-validator');

const router = Router();

// GET SENSORS
router.get('/', validateJWT, getSensors);

// CREATE SENSOR
router.post(
    '/',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('typeOfSensorId', 'El id del tipo de sensor es obligatorio.').not().isEmpty(),
        check('boardId', 'El id de la placa es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    createSensor
);

// UPDATE SENSOR
router.put(
    '/:id',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('typeOfSensorId', 'El id del tipo de sensor es obligatorio.').not().isEmpty(),
        check('boardId', 'El id de la placa es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    updateSensor
);

// DELETE SENSOR
router.delete('/:id', validateJWT, deleteSensor);

module.exports = router;