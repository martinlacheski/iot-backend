/* RUTAS DE ROLES
 * Ruta: host + /api/roles
 */

const { Router } = require('express');
const { getRoles, createRole, updateRole, deleteRole } = require('../../controllers/admin/roleController');
const { validateJWT } = require('../../middlewares/validateJWT');
const { validateFields } = require('../../middlewares/validateFields');
const { check } = require('express-validator');

const router = Router();

// GET ROLES
router.get('/', validateJWT, getRoles);

// CREATE ROLE
router.post(
    '/',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    createRole
);

// UPDATE COUNTRY
router.put(
    '/:id',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    updateRole
);

// DELETE COUNTRY
router.delete('/:id', validateJWT, deleteRole);

module.exports = router;