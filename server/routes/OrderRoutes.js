const express = require("express");
const router = express.Router();
const {
    updateOrderStatus,
    deleteOrder,
    getMyOrders,
    getAllOrders,
    getParticularOrder
} = require('../controllers/OrderController');
const verifyToken = require("../middleware/VerifyToken");

router.post("/updateOrderStatus", verifyToken, updateOrderStatus);
router.post("/deleteOrder", verifyToken, deleteOrder);
router.get("/getMyOrders/:id", verifyToken, getMyOrders);
router.get("/getAllOrders", verifyToken, getAllOrders);
router.get("/getParticularOrder/:id", verifyToken, getParticularOrder);

module.exports = router