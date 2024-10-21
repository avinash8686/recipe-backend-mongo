const express = require("express");
const verify = require("../middleware/privateRoute");
const router = express.Router();
const { getAllCuisines, addACuisine } = require("../Controller/cuisines");

// Public Route
router.get("/", getAllCuisines);

// Private Route only accessible for logged In User
router.post("/", verify, addACuisine);

module.exports = router;
