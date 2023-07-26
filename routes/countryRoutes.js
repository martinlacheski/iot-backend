/* RUTAS DE PAÍSES
 * Ruta: host + /api/countries
 */

const { Router } = require('express');
const { getCountries, createCountry, updateCountry, deleteCountry } = require('../controllers/countryController');
const { validateJWT } = require('../middlewares/validateJWT');
const { validateFields } = require('../middlewares/validateFields');
const { check } = require('express-validator');

const router = Router();

// GET COUNTRIES
router.get('/', validateJWT, getCountries);

// CREATE COUNTRY
router.post(
    '/',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    createCountry
);

// UPDATE COUNTRY
router.put(
    '/:id',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    updateCountry
);

// DELETE COUNTRY
router.delete('/:id', validateJWT, deleteCountry);

module.exports = router;