const { Router } = require("express");
const {
  getEnergyConsumption,
} = require("../../controllers/reports/energyConsumption");
const { validateJWT } = require("../../middlewares/validateJWT");

const router = Router();

router.get("/resume", validateJWT, getEnergyConsumption);

module.exports = router;
