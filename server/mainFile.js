const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const product = require('./schemas/ProductSchema');
const consumer = require('./schemas/consumerSchema');

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


// verifyToken function
function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }
    else {
        try {
            const decoded = jwt.verify(token, secretKey);
            // console.log(decoded, "===>");

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
app.get('/getAllProducts', async (req, res) => {
    try {
        const data = await product.find();
        // console.log(data);
        return res.json({ data: data, message: "Data Fetched" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// getOneProduct
app.get('/getOneProduct/:id', async (req, res) => {
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
app.get('/deleteParticularProduct/:id', async (req, res) => {
    try {
        var id = req.params.id;
        const data = await product.deleteOne({ _id: id });
        // console.log(data);
        return res.json({ data: data, message: "Data Deleted" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// getAdminDashBoardDatas
app.get('/getAdminDashBoardDatas', async (req, res) => {
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
app.get('/getAllConsumers', async (req, res) => {
    try {
        const allConsumers = await consumer.find();
        console.log(allConsumers);
        return res.json({ data: allConsumers, message: "Data Fetched" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
// getOneConsumer
app.get('/getOneConsumer/:id', async (req, res) => {
    try {
        const id = req.params.id
        const getOneConsumer = await consumer.findOne({ _id: id });
        console.log(getOneConsumer);
        return res.json({ data: getOneConsumer, message: "Data Fetched" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
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
                images: "user.jpg"
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
                return res.json({ message: "Login Successfully", data: generateToken });
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