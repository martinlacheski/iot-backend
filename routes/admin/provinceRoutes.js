/* RUTAS DE PROVINCIAS
 * Ruta: host + /api/provinces
 */

const { Router } = require('express');
const { getProvinces, createProvince, updateProvince, deleteProvince } = require('../../controllers/admin/provinceController');
const { validateJWT } = require('../../middlewares/validateJWT');
const { validateFields } = require('../../middlewares/validateFields');
const { check } = require('express-validator');

const router = Router();

// GET PROVINCES
router.get('/', validateJWT, getProvinces);

// CREATE PROVINCE
router.post(
    '/',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('countryId', 'El id del país es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    createProvince
);

// UPDATE PROVINCE
router.put(
    '/:id',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('countryId', 'El id del país es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    updateProvince
);

// DELETE COUNTRY
router.delete('/:id', validateJWT, deleteProvince);

module.exports = router;