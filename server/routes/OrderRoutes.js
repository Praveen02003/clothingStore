const express = require("express");
const router = express.Router();
const {
    updateOrderStatus,
    deleteOrder,
    getMyOrders,
    getAllOrders,
    getParticularOrder,
    getParticularOrderAdmin
} = require('../controllers/OrderController');
const verifyToken = require("../middleware/VerifyToken");
const AdminAuthentication = require("../middleware/AdminAuthentication");
const ConsumerAuthentication = require("../middleware/ConsumerAuthentication");

// admin routes
router.post("/updateOrderStatus", verifyToken, AdminAuthentication, updateOrderStatus);
router.get("/getAllOrders", verifyToken, AdminAuthentication, getAllOrders);
router.get("/getParticularOrderAdmin/:id", verifyToken, AdminAuthentication, getParticularOrderAdmin);

// consumer routes
router.post("/deleteOrder", verifyToken, ConsumerAuthentication, deleteOrder);
router.get("/getMyOrders/:id", verifyToken, ConsumerAuthentication, getMyOrders);
router.get("/getParticularOrder/:id", verifyToken, ConsumerAuthentication, getParticularOrder);

module.exports = router