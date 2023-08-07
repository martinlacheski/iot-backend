/* RUTAS DE EQUIPAMIENTOS
 * Ruta: host + /api/equipments
 */

const { Router } = require('express');
const { getEquipments, createEquipment, updateEquipment, deleteEquipment } = require('../controllers/equipmentController');
const { validateJWT } = require('../middlewares/validateJWT');
const { validateFields } = require('../middlewares/validateFields');
const { check } = require('express-validator');

const router = Router();

// GET EQUIPMENTS
router.get('/', validateJWT, getEquipments);

// CREATE EQUIPMENT
router.post(
    '/',
    [
        validateJWT,
        check('description', 'La descripción es obligatoria.').not().isEmpty(),
        check('typeOfEquipmentId', 'El id del tipo de equipo es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    createEquipment
);

// UPDATE EQUIPMENT
router.put(
    '/:id',
    [
        validateJWT,
        check('description', 'La descripción es obligatoria.').not().isEmpty(),
        check('typeOfEquipmentId', 'El id del tipo de equipo es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    updateEquipment
);

// DELETE EQUIPMENT
router.delete('/:id', validateJWT, deleteEquipment);

module.exports = router;