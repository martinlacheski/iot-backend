const { Router } = require("express");
const {
    getEnergyWasteData,
} = require("../../controllers/reports/energyWaste");
const { validateJWT } = require("../../middlewares/validateJWT");

const router = Router();

router.get("/resume", validateJWT, getEnergyWasteData);

module.exports = router;
