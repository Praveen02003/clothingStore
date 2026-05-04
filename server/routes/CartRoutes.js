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

router.post("/updateCartQuantity", verifyToken, updateCartQuantity);
router.get("/removeFromCart/:id", verifyToken, removeFromCart);
router.post("/cartAdd", verifyToken, cartAdd);
router.post("/getCartData", verifyToken, getCartData);
router.get("/getCart/:id", verifyToken, getCart);



module.exports = router