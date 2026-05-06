const express = require("express");

const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

const router = express.Router();
const {
    getAllConsumers,
    getOneConsumer,
    addUser,
    getAddressDetails,
    updateUser,
    addUsers,
    loginUser,
    forgetPassword,
    sendMail
} = require('../controllers/ConsumerController');
const verifyToken = require("../middleware/VerifyToken");
const ConsumerAuthentication = require("../middleware/ConsumerAuthentication");
const AdminAuthentication = require("../middleware/AdminAuthentication");

// admin routes
router.get("/getAllConsumers", verifyToken, AdminAuthentication, getAllConsumers);
router.get("/getOneConsumer/:id", verifyToken, AdminAuthentication, getOneConsumer);
router.post("/addUser", verifyToken, AdminAuthentication, upload.single("image"), addUser);
router.post("/updateUser", verifyToken, AdminAuthentication, upload.single("image"), updateUser);

// consumer routes
router.get("/getAddressDetails/:id", verifyToken, ConsumerAuthentication, getAddressDetails);

// common routes
router.post("/addUsers", addUsers);
router.post("/loginUser", loginUser);
router.post("/forgetPassword", forgetPassword);
router.get("/sendMail", sendMail);


module.exports = router