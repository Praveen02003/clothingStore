const express = require("express");
const router = express.Router();
const {
    placeOrder,
    paymentDetails,
    failedOrder,
    getPaymentDetailsFromStripe
} = require('../controllers/OrderHistoryController');
const verifyToken = require("../middleware/VerifyToken");
const ConsumerAuthentication = require("../middleware/ConsumerAuthentication");

// consumer routes
router.post("/placeOrder", verifyToken, ConsumerAuthentication, placeOrder);
router.post("/payment", verifyToken, ConsumerAuthentication, paymentDetails);
router.post("/failedOrder", verifyToken, ConsumerAuthentication, failedOrder);
router.get("/getPaymentDetailsFromStripe",getPaymentDetailsFromStripe);

module.exports = router