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
    getAllProducts,
    getOneProduct,
    getAdminDashBoardDatas,
    deleteParticularProducts,
    addProducts,
    upateProducts,
    deleteParticularProduct,
    addProduct,
    upateProduct,
    getFewData,
    getSpecificProduct,
    getAllProduct,
    getMyProduct

} = require('../controllers/ProductController');
const verifyToken = require("../middleware/VerifyToken");
const ConsumerAuthentication = require("../middleware/ConsumerAuthentication");
const AdminAuthentication = require("../middleware/AdminAuthentication");

// admin routes
router.get("/getAdminDashBoardDatas", verifyToken, AdminAuthentication, getAdminDashBoardDatas);
router.get("/getAllProducts", verifyToken, AdminAuthentication, getAllProducts);
router.get("/getOneProduct/:id", verifyToken, AdminAuthentication, getOneProduct);
router.get("/deleteParticularProducts/:id", verifyToken, AdminAuthentication, deleteParticularProducts);
router.post("/addProducts", verifyToken, AdminAuthentication, upload.single("image"), addProducts);
router.post("/upateProducts", verifyToken, AdminAuthentication, upload.single("image"), upateProducts);


// consumer routes
router.get("/getMyProduct/:id", verifyToken, ConsumerAuthentication, getMyProduct);
router.get("/deleteParticularProduct/:id", verifyToken, ConsumerAuthentication, deleteParticularProduct);
router.post("/addProduct", verifyToken, ConsumerAuthentication, upload.single("image"), addProduct);
router.post("/upateProduct", verifyToken, ConsumerAuthentication, upload.single("image"), upateProduct);

// common routes
router.get("/getSpecificProduct/:id", getSpecificProduct);
router.get("/getAllProduct", getAllProduct);
router.get("/getFewData", getFewData);

module.exports = router