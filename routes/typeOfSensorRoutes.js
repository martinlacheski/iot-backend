/* RUTAS DE TIPOS DE SENSORES
 * Ruta: host + /api/types-of-sensors
 */

const { Router } = require('express');

const { getTypesOfSensor, createTypeOfSensor, updateTypeOfSensor, deleteTypeOfSensor } = require('../controllers/typeOfSensorController');
const { validateJWT } = require('../middlewares/validateJWT');
const { validateFields } = require('../middlewares/validateFields');
const { check } = require('express-validator');

const router = Router();

// GET TYPES OF SENSORS
router.get('/', validateJWT, getTypesOfSensor);

// CREATE TYPE OF SENSOR
router.post(
    '/',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    createTypeOfSensor
);

// UPDATE TYPE OF SENSOR
router.put(
    '/:id',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    updateTypeOfSensor
);

// DELETE TYPE OF SENSOR
router.delete('/:id', validateJWT, deleteTypeOfSensor);

module.exports = router;