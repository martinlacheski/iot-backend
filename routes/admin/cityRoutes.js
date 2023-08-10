/* RUTAS DE CIUDADES
 * Ruta: host + /api/cities
 */

const { Router } = require('express');
const { getCities, createCity, updateCity, deleteCity } = require('../../controllers/admin/cityController');
const { validateJWT } = require('../../middlewares/validateJWT');
const { validateFields } = require('../../middlewares/validateFields');
const { check } = require('express-validator');

const router = Router();

// GET CITIES
router.get('/', validateJWT, getCities);

// CREATE CITY
router.post(
    '/',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('postalCode', 'El código postal es obligatorio.').not().isEmpty(),
        check('provinceId', 'El id de la provincia es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    createCity
);

// UPDATE CITY
router.put(
    '/:id',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('postalCode', 'El código postal es obligatorio.').not().isEmpty(),
        check('provinceId', 'El id de la provincia es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    updateCity
);

// DELETE CITY
router.delete('/:id', validateJWT, deleteCity);

module.exports = router;