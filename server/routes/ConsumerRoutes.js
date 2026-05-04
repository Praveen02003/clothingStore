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
    forgetPassword
} = require('../controllers/ConsumerController');
const verifyToken = require("../middleware/VerifyToken");

router.get("/getAllConsumers", verifyToken, getAllConsumers);
router.get("/getOneConsumer/:id", verifyToken, getOneConsumer);
router.post("/addUser", verifyToken, upload.single("image"), addUser);
router.get("/getAddressDetails/:id", verifyToken, getAddressDetails);
router.post("/updateUser", verifyToken, upload.single("image"), updateUser);
router.post("/addUsers", addUsers);
router.post("/loginUser", loginUser);
router.post("/forgetPassword", forgetPassword);


module.exports = router