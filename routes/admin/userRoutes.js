/* RUTAS DE USUARIOS
 * Ruta: host + /api/users
 */

const { Router } = require('express');
const { getUsers, createUser, updateUser, deleteUser, updatePassword } = require('../../controllers/admin/userController');
const { validateJWT } = require('../../middlewares/validateJWT');
const { validateFields } = require('../../middlewares/validateFields');
const { check } = require('express-validator');

const router = Router();

// GET USERS
router.get('/', validateJWT, getUsers);

// CREATE USER
router.post(
    '/',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('email', 'El email es obligatorio.').isEmail(),
        check('password', 'La contraseña debe tener al menos 6 caracteres.').isLength({ min: 6 }),
        check('roleId', 'El rol es obligatorio.').not().isEmpty(),    
        validateFields,
    ],
    createUser
);

// UPDATE USER
router.put(
    '/:id',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('email', 'El email es obligatorio.').isEmail(),
        check('roleId', 'El rol es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    updateUser
);

// DELETE USER
router.delete('/:id', validateJWT, deleteUser);

// UPDATE PASSWORD
router.put(
    '/update-password/:id',
    [
        validateJWT,
        check('password', 'La contraseña debe tener al menos 6 caracteres.').isLength({ min: 6 }),
        validateFields,
    ],
    updatePassword
);

module.exports = router;