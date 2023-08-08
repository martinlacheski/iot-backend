/* RUTAS DE AMBIENTES
    * Ruta: host + /api/environments
*/

const { Router } = require('express');
const { getEnvironments, getEnvironmentById, createEnvironment, updateEnvironment, deleteEnvironment } = require('../controllers/environmentController');
const { validateJWT } = require('../middlewares/validateJWT');
const { validateFields } = require('../middlewares/validateFields');
const { check } = require('express-validator');

const router = Router();

// GET ENVIRONMENTS
router.get('/', validateJWT, getEnvironments);

// GET ENVIRONMENT BY ID
router.get('/:id', validateJWT, getEnvironmentById);

// CREATE ENVIRONMENT
router.post(
    '/',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('typeOfEnvironmentId', 'El id del tipo de ambiente es obligatorio.').not().isEmpty(),
        check('branchId', 'El id de la sucursal es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    createEnvironment
);

// UPDATE ENVIRONMENT
router.put(
    '/:id',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('typeOfEnvironmentId', 'El id del tipo de ambiente es obligatorio.').not().isEmpty(),
        check('branchId', 'El id de la sucursal es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    updateEnvironment
);

// DELETE ENVIRONMENT
router.delete('/:id', validateJWT, deleteEnvironment);

module.exports = router;