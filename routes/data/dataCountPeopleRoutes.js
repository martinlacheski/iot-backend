const { Router } = require("express");
const {
  getLastValue
} = require("../../controllers/data/dataCountPeopleController");
const { validateJWT } = require("../../middlewares/validateJWT");

const router = Router();

router.get("/", validateJWT, getLastValue);

module.exports = router;
