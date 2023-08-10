const { Router } = require("express");
const {
  find,
  filterBetweenDates,
} = require("../../controllers/data/dataConsumptionDevicesController");
const { validateJWT } = require("../../middlewares/validateJWT");

const router = Router();

router.get("/", validateJWT, find);
router.get("/filter-between-dates", filterBetweenDates);

module.exports = router;
