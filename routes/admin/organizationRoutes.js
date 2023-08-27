/* RUTAS DE ORGANIZACION
 * Ruta: host + /api/organizations
 */

const { Router } = require("express");
const {
  getOrganization,
  updateOrganization,
  uploadLogoOrganization,
} = require("../../controllers/admin/organizationController");
const { validateJWT } = require("../../middlewares/validateJWT");
const { validateFields } = require("../../middlewares/validateFields");
const { check } = require("express-validator");
const { upload } = require("../../config/multerConfig");

const router = Router();

// GET FIRST ORGANIZATION
router.get("/", validateJWT, getOrganization);

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
router.post(
  "/upload",
  [validateJWT, upload.single("logo")],
  uploadLogoOrganization
);

module.exports = router;
