const { Router } = require("express");
const {
  getData,
} = require("../../controllers/reports/airQuality");
const { validateJWT } = require("../../middlewares/validateJWT");

const router = Router();

router.get("/resume", validateJWT, getData);

module.exports = router;
