/* RUTAS DE TIPOS DE ENTORNOS
    * Ruta: host + /api/types-of-environments
*/

const { Router } = require('express');
const { getTypesOfEnvironments, createTypeOfEnvironment, updateTypeOfEnvironment, deleteTypeOfEnvironment } = require('../controllers/typesOfEnvironmentsController');
const { validateJWT } = require('../middlewares/validateJWT');
const { validateFields } = require('../middlewares/validateFields');
const { check } = require('express-validator');

const router = Router();

// GET TYPES OF ENVIRONMENTS
router.get('/', validateJWT, getTypesOfEnvironments);

// CREATE TYPE OF ENVIRONMENT
router.post(
    '/',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    createTypeOfEnvironment
);

// UPDATE TYPE OF ENVIRONMENT
router.put(
    '/:id',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    updateTypeOfEnvironment
);

// DELETE TYPE OF ENVIRONMENT
router.delete('/:id', validateJWT, deleteTypeOfEnvironment);

module.exports = router;