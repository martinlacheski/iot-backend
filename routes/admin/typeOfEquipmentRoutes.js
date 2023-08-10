/* RUTAS DE TIPOS DE EQUIPAMIENTOS
 * Ruta: host + /api/typesOfEquipments
 */

const { Router } = require('express');
const { getTypesOfEquipments, createTypeOfEquipment, updateTypeOfEquipment, deleteTypeOfEquipment } = require('../../controllers/admin/typeOfEquipmentController');
const { validateJWT } = require('../../middlewares/validateJWT');
const { validateFields } = require('../../middlewares/validateFields');
const { check } = require('express-validator');

const router = Router();

// GET TYPES OF EQUIPMENTS
router.get('/', validateJWT, getTypesOfEquipments);

// CREATE TYPE OF EQUIPMENT
router.post(
    '/',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    createTypeOfEquipment
);

// UPDATE TYPE OF EQUIPMENT
router.put(
    '/:id',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    updateTypeOfEquipment
);

// DELETE TYPE OF EQUIPMENT
router.delete('/:id', validateJWT, deleteTypeOfEquipment);

module.exports = router;