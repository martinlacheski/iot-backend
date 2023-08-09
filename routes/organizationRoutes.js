/* RUTAS DE ORGANIZACION
 * Ruta: host + /api/organizations
 */

const { Router } = require("express");
const {
  getOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} = require("../controllers/organizationController");
const { validateJWT } = require("../middlewares/validateJWT");
const { validateFields } = require("../middlewares/validateFields");
const { check } = require("express-validator");

const router = Router();

// GET ORGANIZATIONS
// router.get("/", validateJWT, getOrganizations);

// GET FIRST ORGANIZATION
router.get("/", validateJWT, getOrganization);

// CREATE ORGANIZATION
// router.post(
//   "/",
//   [
//     validateJWT,
//     check("name", "El nombre es obligatorio.").not().isEmpty(),
//     check("address", "La dirección es obligatoria.").not().isEmpty(),
//     check("cityId", "El id de la ciudad es obligatorio.").not().isEmpty(),
//     validateFields,
//   ],
//   createOrganization
// );

// UPDATE ORGANIZATION
router.put(
  "/:id",
  [
    validateJWT,
    check("name", "El nombre es obligatorio.").not().isEmpty(),
    check("address", "La dirección es obligatoria.").not().isEmpty(),
    check("cityId", "El id de la ciudad es obligatorio.").not().isEmpty(),
    validateFields,
  ],
  updateOrganization
);

// DELETE ORGANIZATION
// router.delete("/:id", validateJWT, deleteOrganization);

module.exports = router;