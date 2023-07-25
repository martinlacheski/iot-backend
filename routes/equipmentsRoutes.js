/* RUTAS DE EQUIPAMIENTOS
 * Ruta: host + /api/equipments
 */

const { Router } = require('express');
const { getEquipments, createEquipment, updateEquipment, deleteEquipment } = require('../controllers/equipmentsController');
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
        check('quantity', 'La cantidad es obligatoria.').not().isEmpty(),
        check('quantity', 'La cantidad debe ser mayor a 0.').isInt({ min: 1 }),
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
        check('quantity', 'La cantidad es obligatoria.').not().isEmpty(),
        check('quantity', 'La cantidad debe ser mayor a 0.').isInt({ min: 1 }),
        validateFields,
    ],
    updateEquipment
);

// DELETE EQUIPMENT
router.delete('/:id', validateJWT, deleteEquipment);

module.exports = router;