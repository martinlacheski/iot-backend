const { Router } = require("express");
const {
  find, filterBetweenDates, resume
} = require("../../controllers/data/dataConsumptionACController");
const { validateJWT } = require("../../middlewares/validateJWT");

const router = Router();

router.get("/", validateJWT, find);
router.get("/filter-between-dates", filterBetweenDates);
router.get("/resume", resume);

module.exports = router;
