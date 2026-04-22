const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const product = require('./schemas/ProductSchema');
const consumer = require('./schemas/consumerSchema');
const multer = require("multer");


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

var port = process.env.PORT || 5000;

var secretKey = process.env.JWT_SECRET_KEY
// console.log(secretKey);


const url = process.env.dbUrl || 'mongodb://localhost:27017/clothingStore';
const client = new MongoClient(url);


// connectDb function
async function connectDb() {
    try {
        await mongoose.connect(url);

        console.log("connected");

    } catch (err) {
        console.error(err);
    }
}

connectDb();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploadingImages/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

app.use("/uploadingImages", express.static("uploadingImages"));

// verifyToken function
function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }
    else {
        try {
            const decoded = jwt.verify(token, secretKey);
            console.log(decoded, "===>");

            req.userId = decoded.userId;
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: 'Invalid token' });
        }
    }
};


// admin side
// getAllProducts
app.get('/getAllProducts', verifyToken, async (req, res) => {
    try {
        const data = await product.find();
        // console.log(data);
        return res.json({ data: data, message: "Data Fetched" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// getOneProduct
app.get('/getOneProduct/:id', verifyToken, async (req, res) => {
    try {
        var id = req.params.id;
        const data = await product.findOne({ _id: id });
        // console.log(data);
        return res.json({ data: data, message: "Data Fetched" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// deleteOneProduct
app.get('/deleteParticularProduct/:id', verifyToken, async (req, res) => {
    try {
        var id = req.params.id;
        const data = await product.deleteOne({ _id: id });
        // console.log(data);
        return res.json({ data: data, message: "Product Deleted Successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// getAdminDashBoardDatas
app.get('/getAdminDashBoardDatas', verifyToken, async (req, res) => {
    try {
        const allData = {};
        const productCount = await product.countDocuments();
        const consumerCount = await consumer.countDocuments();
        console.log(productCount);
        allData['productCount'] = productCount
        allData['consumerCount'] = consumerCount
        return res.json({ data: allData, message: "Data Fetched" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// getAllConsumers
app.get('/getAllConsumers', verifyToken, async (req, res) => {
    try {
        const allConsumers = await consumer.find();
        console.log(allConsumers);
        return res.json({ data: allConsumers, message: "Data Fetched" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
// getOneConsumer
app.get('/getOneConsumer/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id
        const getOneConsumer = await consumer.findOne({ _id: id });
        console.log(getOneConsumer);
        return res.json({ data: getOneConsumer, message: "Data Fetched" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// addproduct route
app.post('/addProducts', verifyToken, upload.single("image"), async (req, res) => {
    const data = req.body;
    const imageFile = req.file;
    try {
        const getData = await product.findOne({ name: data.name })
        if (getData) {
            return res.json({ message: "Product Alreday Added" })
        }
        else {
            await product.insertOne({
                name: data.name,
                price: data.price,
                defaultPrice: data.defaultPrice,
                offer: data.offer,
                description: data.description,
                stock: data.stock,
                color: data.color,
                size: data.size,
                image: imageFile.originalname,
                category: data.category
            });
        }
        return res.json({ message: "Product Added Successfully" })
    } catch (error) {
        return res.json({ message: error })
    }
});

// updateproduct route
app.post('/upateProducts', verifyToken, upload.single("image"), async (req, res) => {
    const data = req.body;
    const imageFile = req.file;

    try {
        const getData = await product.findOne({ name: data.name });

        if (!getData) {
            return res.json({ message: "Product not found" });
        }

        let checkData = {
            name: data.name,
            price: data.price,
            defaultPrice: data.defaultPrice,
            offer: data.offer,
            description: data.description,
            stock: data.stock,
            color: data.color,
            size: data.size,
            category: data.category
        };

        if (imageFile) {
            checkData.image = imageFile.originalname;
        }

        await product.updateOne({ name: data.name }, checkData);

        return res.json({ message: "Product Updated Successfully" });

    } catch (error) {
        return res.json({ message: error });
    }
});

// addUsers route
app.post('/addUsers', async (req, res) => {
    const data = req.body.data;
    const saltRounds = 12;
    try {
        var getData = await consumer.findOne({ email: data.email })
        // console.log(getData);
        if (!getData) {
            var hashPassword = await bcrypt.hash(data.password, saltRounds);
            // console.log(hashPassword, "===>");

            await consumer.insertOne({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                mobile: "+91" + data.mobile,
                gender: data.gender,
                password: hashPassword,
                terms: data.terms,
                role: "user",
                status: "active",
                images: "",
                address: data.address
            })
            return res.json({ message: "Signup Successfully" });
        }
        else {
            return res.json({ message: "Email Already Exists" });
        }
    } catch (error) {
        return res.json({ message: error });
    }
});

// loginUser route
app.post('/loginUser', async (req, res) => {
    const data = req.body.data;
    try {
        var getData = await consumer.findOne({ email: data.email })
        // console.log(getData);
        if (getData) {
            var comparePassword = await bcrypt.compare(data.password, getData.password);
            // console.log(comparePassword, "===>");
            if (comparePassword) {
                var generateToken = jwt.sign({ userId: getData._id }, secretKey, {
                    expiresIn: '1h',
                });
                return res.json({ message: "Login Successfully", data: getData, token: generateToken });
            }
            else {
                return res.json({ message: "Password Mismatch" });
            }
        }
        else {
            return res.json({ message: "Invalid Credentials" });
        }
    } catch (error) {
        return res.json({ message: error });
    }
});

app.listen(port, () => {
    console.log(`server running at port ${port}`);
});