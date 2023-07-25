/* RUTAS DE SEDES
 * Ruta: host + /api/branches
 */

const { Router } = require('express');
const { getBranches, createBranch, updateBranch, deleteBranch } = require('../controllers/branchesController');
const { validateJWT } = require('../middlewares/validateJWT');
const { validateFields } = require('../middlewares/validateFields');
const { check } = require('express-validator');

const router = Router();

// GET BRANCHES
router.get('/', validateJWT, getBranches);

// CREATE BRANCH
router.post(
    '/',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('organizationId', 'El id de la organización es obligatorio.').not().isEmpty(),
        check('cityId', 'El id de la ciudad es obligatorio.').not().isEmpty(),
        check('address', 'La dirección es obligatoria.').not().isEmpty(),
        validateFields,
    ],
    createBranch
);

// UPDATE BRANCH
router.put(
    '/:id',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('organizationId', 'El id de la organización es obligatorio.').not().isEmpty(),
        check('cityId', 'El id de la ciudad es obligatorio.').not().isEmpty(),
        check('address', 'La dirección es obligatoria.').not().isEmpty(),
        validateFields,
    ],
    updateBranch
);

// DELETE BRANCH
router.delete('/:id', validateJWT, deleteBranch);

module.exports = router;