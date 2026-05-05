const express = require("express");
const router = express.Router();
const {
    placeOrder,
    paymentDetails
} = require('../controllers/OrderHistoryController');
const verifyToken = require("../middleware/VerifyToken");

router.post("/placeOrder", verifyToken, placeOrder);
router.post("/payment", verifyToken, paymentDetails);

module.exports = router