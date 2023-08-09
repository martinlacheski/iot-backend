/* RUTAS DE TIPOS DE PLACAS
 * Ruta: host + /test
 */

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validateJWT');

const router = Router();

router.post('/', validateJWT, (req, res) => {

    const count = req.body.count;

    res.json({
        ok: true,
        msg: 'Test route.',
        count
    });
});

module.exports = router;
