const express = require("express");
const router = express.Router();
const { addTrain } = require("../controllers/adminController");
const checkApiKey = require("../middlewares/checkApi");

router.post("/add-train", checkApiKey, addTrain);
module.exports = router;
