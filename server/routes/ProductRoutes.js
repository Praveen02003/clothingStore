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
    deleteParticularProduct,
    getAdminDashBoardDatas,
    addProducts,
    upateProducts,
    getFewData,
    getSpecificProduct,
    getAllProduct,
    getMyProduct

} = require('../controllers/ProductController');
const verifyToken = require("../middleware/VerifyToken");

router.get("/getAllProducts", verifyToken, getAllProducts);
router.get("/getOneProduct/:id", getOneProduct);
router.get("/deleteParticularProduct/:id", verifyToken, deleteParticularProduct);
router.get("/getAdminDashBoardDatas", verifyToken, getAdminDashBoardDatas);
router.post("/addProducts", verifyToken, upload.single("image"), addProducts);
router.post("/upateProducts", verifyToken, upload.single("image"), upateProducts);
router.get("/getFewData", getFewData);
router.get("/getSpecificProduct/:id", getSpecificProduct);
router.get("/getAllProduct", getAllProduct);
router.get("/getMyProduct/:id", verifyToken, getMyProduct);

module.exports = router