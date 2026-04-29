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
const cart = require('./schemas/cartSchema');
const order = require('./schemas/orderShema');
const orderHistory = require('./schemas/orderHistorySchema');


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
        var categorySort = {}
        var priceSort = {}

        var page = parseInt(req.query.page) || 1;
        var limitItem = parseInt(req.query.count) || 5;
        const skipPage = (page - 1) * limitItem;

        var category = req.query.category;
        if (category) {
            categorySort.category = category
        }

        var price = req.query.price;

        if (price === "lowest") {
            priceSort.price = 1
        }
        else if (price === "highest") {
            priceSort.price = -1
        }
        else {
            priceSort.addedOn = -1
        }

        var searchData = req.query.search;

        if (searchData) {
            categorySort.$or = [
                { name: { $regex: searchData, $options: "i" } },
                { category: { $regex: searchData, $options: "i" } }
            ];
        }

        const data = await product.aggregate([
            { $match: categorySort },
            {
                $lookup: {
                    from: "consumers",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $sort: priceSort },
            { $skip: skipPage },
            { $limit: limitItem }
        ])

        var totalProducts = await product.countDocuments(categorySort);

        return res.json({ data: data, totalPage: totalProducts, message: "Data Fetched" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

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
        var paramsData = req.query.startDate
        var startDate = new Date(paramsData)
        console.log(startDate);
        var todayDate = new Date();
        const allData = {};

        // productCount
        var productCount = await product.find({
            $and: [
                { addedOn: { $gte: startDate } },
                { addedOn: { $lte: todayDate } }
            ]
        }).countDocuments()
        // console.log(productCount);
        allData['productCount'] = productCount

        // consumerCount
        var consumerCount = await consumer.find({
            $and: [
                { addedOn: { $gte: startDate } },
                { addedOn: { $lte: todayDate } }
            ]
        }).countDocuments()

        allData['consumerCount'] = consumerCount
        // ordersCount
        var ordersCount = await order.countDocuments()

        allData['ordersCount'] = ordersCount
        console.log(allData);

        // totalPurchase
        var totalPurchase = await orderHistory.aggregate([
            {
                $group: {
                    _id: "$userId",
                    totalRevenue: { $sum: "$totalPrice" }
                }

            },
            {
                $project: { totalRevenue: 1, _id: 0 }
            }
        ])

        allData['totalPurchase'] = totalPurchase[0].totalRevenue
        console.log(allData);


        return res.json({ data: allData, message: "Data Fetched" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// getAllConsumers
app.get('/getAllConsumers', verifyToken, async (req, res) => {
    var page = parseInt(req.query.page) || 1;
    var limitItem = parseInt(req.query.count) || 5;
    var status = req.query.category;

    var searchData = req.query.search;
    console.log(searchData, "====>");

    var categorySort = { role: "user" };

    if (searchData) {
        categorySort.$or = [
            { firstName: { $regex: searchData, $options: "i" } },
            { email: { $regex: searchData, $options: "i" } },
        ];
    }
    else if (status) {
        categorySort.status = status
    }

    const skipPage = (page - 1) * limitItem;
    try {
        const allConsumers = await consumer.find(categorySort).sort({ addedOn: -1 }).skip(skipPage).limit(limitItem);
        const totalConsumers = await consumer.countDocuments(categorySort);
        console.log(allConsumers);
        return res.json({ data: allConsumers, totalPage: totalConsumers, message: "Data Fetched" });
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
    const date = new Date();
    const imageFile = req.file;
    console.log(data);
    console.log(req.userId);


    try {
        const getData = await product.findOne({ name: data.name })
        if (getData) {
            return res.json({ message: "Product Already Added" })
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
                category: data.category,
                addedOn: date,
                editedOn: date,
                userId: req.userId
            });
        }
        return res.json({ message: "Product Added Successfully" })
    } catch (error) {
        console.log(error);

        return res.json({ message: "Product Added Failed" })
    }
});

// updateproduct route
app.post('/upateProducts', verifyToken, upload.single("image"), async (req, res) => {
    const data = req.body;
    const date = new Date();
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
            category: data.category,
            editedOn: date
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

// consumer routes
// getFewData route
app.get('/getFewData', async (req, res) => {
    try {
        // const data = await product.find().limit(6);
        const data = await product.aggregate([
            {
                $lookup: {
                    from: "consumers",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $sort: { addedOn: -1 } },
            { $limit: 6 }
        ])
        // console.log(data);
        return res.json({ data: data, message: "Data Fetched" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

// getSpecificProduct route
app.get('/getSpecificProduct/:id', async (req, res) => {
    try {
        var id = req.params.id;
        const data = await product.findOne({ _id: id });
        // console.log(data);
        return res.json({ data: data, message: "Data Fetched" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

// getAllProduct route
app.get('/getAllProduct', async (req, res) => {

    try {
        var categorySort = {}
        var priceSort = {}

        var page = parseInt(req.query.page) || 1;
        var limitItem = parseInt(req.query.count) || 5;
        const skipPage = (page - 1) * limitItem;

        var category = req.query.category;
        if (category) {
            categorySort.category = category
        }

        var price = req.query.price;

        if (price === "lowest") {
            priceSort.price = 1
        }
        else if (price === "highest") {
            priceSort.price = -1
        }
        else {
            priceSort.addedOn = -1
        }

        var searchData = req.query.search;

        if (searchData) {
            categorySort.$or = [
                { name: { $regex: searchData, $options: "i" } },
                { category: { $regex: searchData, $options: "i" } }
            ];
        }

        const data = await product.aggregate([
            { $match: categorySort },
            {
                $lookup: {
                    from: "consumers",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $sort: priceSort },
            { $skip: skipPage },
            { $limit: limitItem }
        ])

        var totalProducts = await product.countDocuments(categorySort);

        return res.json({ data: data, totalPage: totalProducts, message: "Data Fetched" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

// getMyProduct route
app.get('/getMyProduct/:id', verifyToken, async (req, res) => {
    var userId = req.params.id
    console.log(new ObjectId(userId));


    try {
        var categorySort = { userId: new ObjectId(userId) };
        var priceSort = {}

        var page = parseInt(req.query.page) || 1;
        var limitItem = parseInt(req.query.count) || 5;
        const skipPage = (page - 1) * limitItem;

        var category = req.query.category;
        // console.log(category, "====>");
        if (category !== null && category) {
            categorySort.category = category
        }
        var price = req.query.price;
        // console.log(price);
        if (price === "lowest") {
            priceSort = { price: 1 }
        }
        else if (price === "highest") {
            priceSort = { price: -1 }
        }
        else {
            priceSort = { addedOn: -1 }
        }

        var searchData = req.query.search;
        console.log(searchData, "====>");

        if (searchData) {
            categorySort.$and = [
                { userId: new ObjectId(userId) },
                {
                    $or: [
                        { name: { $regex: searchData, $options: "i" } },
                        { category: { $regex: searchData, $options: "i" } }
                    ]
                }
            ];
        }
        console.log(priceSort);
        var data;
        var length = Object.keys(priceSort)?.length;

        if (length > 0) {
            data = await product.aggregate([
                { $match: categorySort },
                {
                    $lookup: {
                        from: "consumers",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $sort: priceSort },
                { $skip: skipPage },
                { $limit: limitItem }
            ])
        }
        else {
            data = await product.aggregate([
                { $match: categorySort },
                {
                    $lookup: {
                        from: "consumers",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $skip: skipPage },
                { $limit: limitItem }
            ])
        }


        // const data = await product.find(categorySort).sort(priceSort).skip(skipPage).limit(limitItem).populate("userId");;
        console.log(data);
        var totalProducts = await product.countDocuments(categorySort);
        console.log(totalProducts);

        return res.json({ data: data, totalPage: totalProducts, message: "Data Fetched" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

// addUser route
app.post('/addUser', verifyToken, async (req, res) => {
    const data = req.body.data;
    const date = new Date();
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
                mobile: data.mobile,
                gender: data.gender,
                password: hashPassword,
                terms: data.terms,
                role: "user",
                status: "active",
                images: "",
                address: data.address,
                addedOn: date,
                editedOn: date
            })
            return res.json({ message: "New User Added Successfully" });
        }
        else {
            return res.json({ message: "User Already Exists" });
        }
    } catch (error) {
        return res.json({ message: error });
    }
});

// cartAdd route
app.post('/cartAdd', verifyToken, async (req, res) => {
    try {
        const data = req.body.data;
        console.log(data)

        var date = new Date()

        var userId = data.userId
        var productId = data.productId

        const existingProduct = await cart.findOne({
            $and: [
                { userId: userId },
                { productId: productId }
            ]
        });
        console.log(existingProduct, "====>")


        if (existingProduct) {
            await cart.deleteOne({ _id: existingProduct._id });

            return res.json({ message: "Product removed from cart" });
        } else {
            await cart.insertOne({
                userId: userId,
                productId: productId,
                quantity: 1,
                addedOn: date,
                editedOn: date
            });

            return res.json({ message: "Product added to cart" });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// getCartData route
app.post('/getCartData', verifyToken, async (req, res) => {
    try {
        const data = req.body.data;
        console.log(data)


        var userId = data.userId

        const findProduct = await cart.find({ userId: userId }, { productId: 1, _id: 0 });
        console.log(findProduct, "====>")
        var newArray = []
        findProduct.forEach(element => {
            newArray.push(element.productId)
        });
        return res.json({ message: "Data fetched", data: newArray });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// getCart route
app.get('/getCart/:id', verifyToken, async (req, res) => {
    try {
        const data = req.params.id;
        console.log(data)


        var userId = data

        const datas = await cart.aggregate([
            { $match: { userId: new ObjectId(userId) } },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $lookup: {
                    from: "consumers",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            }
        ]);

        return res.json({ message: "Data fetched", data: datas });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// updateCartQuantity route
app.post('/updateCartQuantity', verifyToken, async (req, res) => {
    try {
        const data = req.body.data;
        const cartId = data.cartId;
        const quantity = Number(data.quantity);

        const findData = await cart.findById(cartId);

        if (!findData) {
            return res.json({ message: "Cart not found" });
        }
        var productId = findData.productId

        const findProduct = await product.findOne({ _id: productId });

        if (!findProduct) {
            return res.json({ message: "product not found" });
        }

        if (quantity > findProduct.stock) {
            return res.json({
                message: `Only ${findProduct.stock} items available`
            });
        }

        await cart.updateOne(
            { _id: cartId },
            {
                $set: {
                    quantity: quantity,
                    editedOn: new Date()
                }
            }
        );

        return res.json({ message: "quantity updated success" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// placeOrder route
app.post('/placeOrder', verifyToken, async (req, res) => {
    try {
        const data = req.body.data;
        const date = new Date();

        const createEntry = await order.create({
            userId: req.userId,
            status: "placed",
            addedOn: date,
            editedOn: date
        });

        const orderId = createEntry._id;

        for (const element of data) {
            var id = element.productId
            const findProduct = await product.findOne({ _id: id });

            if (element.quantity > findProduct.stock) {
                return res.json({ message: "Insufficient stock" });
            }
            var calculateStock = findProduct.stock - element.quantity
            await product.updateOne(
                { _id: element.productId },
                { stock: calculateStock }
            );

            await orderHistory.insertOne({
                orderId: orderId,
                productId: element.productId,
                quantity: element.quantity,
                totalPrice: findProduct.price * element.quantity,
                addedOn: date,
                editedOn: date
            });
        }

        await cart.deleteMany({ userId: req.userId });

        return res.json({ message: "order placed" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// getMyOrders route
app.get('/getMyOrders/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.params.id;
        var getOrders = await order.aggregate([
            {
                $match: {
                    userId: new ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "orderhistories",
                    localField: "_id",
                    foreignField: "orderId",
                    as: "orderHistory"
                }
            },
            {
                $lookup: {
                    from: "consumers",
                    localField: "userId",
                    foreignField: "_id",
                    as: "orderUser"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "orderHistory.productId",
                    foreignField: "_id",
                    as: "orderProduct"
                }
            }
        ]);
        console.log(getOrders);


        return res.json({ message: "data fetched", data: getOrders });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// getAllOrders route
app.get('/getAllOrders', verifyToken, async (req, res) => {
    try {
        var getOrders = await order.aggregate([
            {
                $lookup: {
                    from: "orderhistories",
                    localField: "_id",
                    foreignField: "orderId",
                    as: "orderHistory"
                }
            },
            {
                $lookup: {
                    from: "consumers",
                    localField: "userId",
                    foreignField: "_id",
                    as: "orderUser"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "orderHistory.productId",
                    foreignField: "_id",
                    as: "orderProduct"
                }
            }
        ]);
        console.log(getOrders);


        return res.json({ message: "data fetched", data: getOrders });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// getParticularOrder route
app.get('/getParticularOrder/:id', verifyToken, async (req, res) => {
    try {
        var orderId = req.params.id
        var getOrders = await order.aggregate([
            { $match: { _id: new ObjectId(orderId) } },
            {
                $lookup: {
                    from: "orderhistories",
                    localField: "_id",
                    foreignField: "orderId",
                    as: "orderHistory"
                }
            },
            {
                $lookup: {
                    from: "consumers",
                    localField: "userId",
                    foreignField: "_id",
                    as: "orderUser"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "orderHistory.productId",
                    foreignField: "_id",
                    as: "orderProduct"
                }
            }
        ]);
        console.log(getOrders);


        return res.json({ message: "data fetched", data: getOrders });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// removeFromCart route
app.get('/removeFromCart/:id', verifyToken, async (req, res) => {
    try {

        var cartId = req.params.id

        var findData = await cart.findOne({ _id: cartId })
        if (findData) {
            await cart.deleteOne({ _id: cartId })
            return res.json({ message: "item deleted successfully" });

        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// updateUser route
app.post('/updateUser', verifyToken, upload.single("image"), async (req, res) => {
    const data = req.body;
    console.log(data);

    const saltRounds = 12;
    const imageFile = req.file;

    try {
        const existingUser = await consumer.findOne({ email: data.email });

        if (!existingUser) {
            return res.json({ message: "User not found" });
        }

        var updateData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            mobile: data.mobile,
            gender: data.gender,
            terms: data.terms,
            address: data.address,
            editedOn: new Date()
        };
        if (imageFile) {
            updateData.image = imageFile.filename;
        }

        if (data.newPassword && data.confirmPassword) {
            const hashPassword = await bcrypt.hash(data.newPassword, saltRounds);
            updateData.password = hashPassword;
        }
        if (imageFile) {
            updateData.images = imageFile.originalname;
        }

        await consumer.updateOne(
            { email: data.email },
            { $set: updateData }
        );

        return res.json({ message: "User updated successfully" });

    } catch (error) {
        return res.json({ message: error.message });
    }
});

// addUsers route
app.post('/addUsers', async (req, res) => {
    const data = req.body.data;
    const date = new Date();
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
                mobile: data.mobile,
                gender: data.gender,
                password: hashPassword,
                terms: data.terms,
                role: "user",
                status: "active",
                images: "",
                address: data.address,
                addedOn: date,
                editedOn: date
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

// forgetPassword route
app.post('/forgetPassword', async (req, res) => {
    const data = req.body.data;
    console.log(data);
    const saltRounds = 12;
    try {
        if (data.email && data.securityQuestion && data.password && data.confirmPassword) {
            const user = await consumer.findOne({ email: data.email });
            if (!user) {
                return res.json({ message: "Invalid credentials" });
            }

            if (user.lastName.toLowerCase() === data.securityQuestion.toLowerCase()) {
                var hashPassword = await bcrypt.hash(data.password, saltRounds)
                const updatePassword = await consumer.updateOne({ email: data.email }, { $set: { password: hashPassword } });
                return res.json({ message: "Password reset success" });
            } else {
                return res.json({ message: "Invalid lastName" });
            }
        }
        else if (data.email && data.securityQuestion) {
            const user = await consumer.findOne({ email: data.email });
            if (!user) {
                return res.json({ message: "Invalid credentials" });
            }
            if (user.lastName.toLowerCase() === data.securityQuestion.toLowerCase()) {
                return res.json({ message: "Validate success" });
            } else {
                return res.json({ message: "Invalid lastName" });
            }
        }
        else if (data.email) {
            const user = await consumer.findOne({ email: data.email });
            if (user) {
                return res.json({ message: "Data present" });
            } else {
                return res.json({ message: "Invalid credentials" });
            }
        }

    } catch (error) {
        return res.json({ message: "server error" });
    }
});

app.listen(port, () => {
    console.log(`server running at port ${port}`);
});