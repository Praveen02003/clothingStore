const express = require("express");
const router = express.Router();
const {
    placeOrder,
} = require('../controllers/OrderHistoryController');
const verifyToken = require("../middleware/VerifyToken");

router.post("/placeOrder", verifyToken, placeOrder);

module.exports = router