/* RUTAS DE TIPOS DE PLACAS
 * Ruta: host + /api/typesOfBoards
 */

const { Router } = require('express');
const { getTypesOfBoards, createTypeOfBoard, updateTypeOfBoard, deleteTypeOfBoard } = require('../controllers/typesOfBoardsController');
const { validateJWT } = require('../middlewares/validateJWT');
const { validateFields } = require('../middlewares/validateFields');
const { check } = require('express-validator');

const router = Router();

// GET TYPES OF BOARDS
router.get('/', validateJWT, getTypesOfBoards);

// CREATE TYPE OF BOARD
router.post(
    '/',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    createTypeOfBoard
);

// UPDATE TYPE OF BOARD
router.put(
    '/:id',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        validateFields,
    ],
    updateTypeOfBoard
);

// DELETE TYPE OF BOARD
router.delete('/:id', validateJWT, deleteTypeOfBoard);

module.exports = router;