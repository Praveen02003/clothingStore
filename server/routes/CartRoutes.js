const express = require("express");
const router = express.Router();
const {
    updateCartQuantity,
    removeFromCart,
    cartAdd,
    getCartData,
    getCart

} = require('../controllers/CartController');
const verifyToken = require("../middleware/VerifyToken");
const ConsumerAuthentication = require("../middleware/ConsumerAuthentication");

// consumer
router.post("/updateCartQuantity", verifyToken, ConsumerAuthentication, updateCartQuantity);
router.get("/removeFromCart/:id", verifyToken, ConsumerAuthentication, removeFromCart);
router.post("/cartAdd", verifyToken, ConsumerAuthentication, cartAdd);
router.post("/getCartData", verifyToken, ConsumerAuthentication, getCartData);
router.get("/getCart/:id", verifyToken, ConsumerAuthentication, getCart);



module.exports = router