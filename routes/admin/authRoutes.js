/* RUTAS DE USUARIOS / AUTH
 * Ruta: host + /api/auth
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { login, revalidateToken } = require('../../controllers/admin/authController');
const { validateFields } = require('../../middlewares/validateFields');
const { validateJWT } = require('../../middlewares/validateJWT');

const router = Router();

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