/* RUTAS DE USUARIOS / AUTH
 * Ruta: host + /api/auth
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { register, login, revalidateToken } = require('../../controllers/admin/authController');
const { validateFields } = require('../../middlewares/validateFields');
const { validateJWT } = require('../../middlewares/validateJWT');

const router = Router();

// REGISTER
router.post(
    '/register',
    [
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('email', 'El email es obligatorio.').isEmail(),
        check('password', 'La contraseña debe tener al menos 6 caracteres.').isLength({ min: 6 }),
        validateFields,
    ],
    register
);

// LOGIN
router.post(
    '/login',
    [
        check('email', 'El email es obligatorio.').isEmail(),
        check('password', 'La contraseña es obligatoria.').isLength({ min: 6 }),
        validateFields,
    ],
    login
);

// REVALIDATE TOKEN
router.get('/renew', validateJWT, revalidateToken);

module.exports = router;