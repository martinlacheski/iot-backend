const { Router } = require("express");
const {
  find, create, filterBetweenDates
} = require("../../controllers/data/dataConsumptionACController");
const { validateJWT } = require("../../middlewares/validateJWT");

const router = Router();

router.get("/", validateJWT, find);
router.post("/", create);
router.get("/filter-between-dates", filterBetweenDates);

module.exports = router;
