/* RUTAS DE PLACAS
 * Ruta: host + /api/boards
 */

const { Router } = require('express');
const { getBoards, createBoard, updateBoard, deleteBoard } = require('../../controllers/admin/boardController');
const { validateJWT } = require('../../middlewares/validateJWT');
const { validateFields } = require('../../middlewares/validateFields');
const { check } = require('express-validator');

const router = Router();

// GET BOARDS
router.get('/', validateJWT, getBoards);

// CREATE BOARD
router.post(
    '/',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('typeOfBoardId', 'El id del tipo de placa es obligatorio.').not().isEmpty(),
        check('environmentId', 'El id del ambiente es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    createBoard
);

// UPDATE BOARD
router.put(
    '/:id',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('typeOfBoardId', 'El id del tipo de placa es obligatorio.').not().isEmpty(),
        check('environmentId', 'El id del ambiente es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    updateBoard
);

// DELETE BOARD
router.delete('/:id', validateJWT, deleteBoard);

module.exports = router;