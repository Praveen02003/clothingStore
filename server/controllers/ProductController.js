const product = require('../models/ProductModel')

const cart = require('../models/CartModel')

const order = require('../models/OrderModel')

const orderHistory = require('../models/OrderHistoryModel')

const consumer = require('../models/ConsumerModel')

const { MongoClient, ObjectId } = require('mongodb');

const payment = require('../models/PaymentModel')

// getAllProducts function
const getAllProducts = async (req, res) => {
    try {
        var categorySort = {}
        var priceSort = {}

        var page = parseInt(req.query.page) || 1;
        var limitItem = parseInt(req.query.count) || 5;
        const skipPage = (page - 1) * limitItem;

        console.log(page);
        console.log(limitItem);
        console.log(skipPage);

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
            priceSort._id = -1
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
        // console.log(data);


        var totalProducts = await product.countDocuments(categorySort);
        return res.json({ data: data, totalPage: totalProducts, message: "productData Fetched" });

    } catch (error) {
        console.log(error);

        return res.status(500).json({ error: error.message });
    }
}

// getOneProduct function
const getOneProduct = async (req, res) => {
    try {
        var id = req.params.id;
        const data = await product.findOne({ _id: id });
        // console.log(data);
        return res.json({ data: data, message: "productData Fetched" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// deleteParticularProducts function
const deleteParticularProducts = async (req, res) => {
    try {
        var id = req.params.id;
        const data = await product.deleteOne({ _id: id });
        // console.log(data);
        return res.json({ data: data, message: "Product Deleted Successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// addProducts function
const addProducts = async (req, res) => {
    const data = req.body;
    console.log(data, "===>");

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
}

// upateProducts function
const upateProducts = async (req, res) => {
    const data = req.body;
    const date = new Date();
    const imageFile = req.file;
    console.log(data);


    try {
        const getData = await product.findOne({ _id: data.id });

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

        await product.updateOne({ _id: data.id }, checkData);
        return res.json({ message: "Product Updated Successfully" });

    } catch (error) {
        return res.json({ message: error });
    }
}

// getAdminDashBoardDatas function
const getAdminDashBoardDatas = async (req, res) => {
    try {
        var startDate = req.query.startDates
        var endDate = req.query.endDates
        var convertStartDate = startDate ? new Date(startDate) : new Date(0)
        var convertEndDate = endDate ? new Date(endDate) : new Date()

        console.log(convertStartDate);
        console.log(convertEndDate);
        convertEndDate.setDate(convertEndDate.getDate() + 1)

        const allData = {};

        // productCount
        var productCount = await product.find({
            $and: [
                { addedOn: { $gte: convertStartDate } },
                { addedOn: { $lt: convertEndDate } }
            ]
        }).countDocuments()
        // console.log(productCount);
        allData['productCount'] = productCount

        // consumerCount
        var consumerCount = await consumer.find({
            $and: [
                { addedOn: { $gte: convertStartDate } },
                { addedOn: { $lt: convertEndDate } }
            ]
        }).countDocuments({ role: "user" })

        allData['consumerCount'] = consumerCount
        // ordersCount
        var ordersCount = await order.countDocuments(
            {
                $and: [
                    { addedOn: { $gte: convertStartDate } },
                    { addedOn: { $lt: convertEndDate } }
                ]
            }
        )

        allData['ordersCount'] = ordersCount
        console.log(allData);

        // orderSuccessCount
        var orderSuccessCount = await payment.find({
            $and: [
                { addedOn: { $gte: convertStartDate } },
                { addedOn: { $lt: convertEndDate } }
            ]
        }).countDocuments({ paymentStatus: "paid" })

        allData['orderSuccessCount'] = orderSuccessCount
        console.log(allData);

        // orderFailedCount
        var orderFailedCount = await payment.find({
            $and: [
                { addedOn: { $gte: convertStartDate } },
                { addedOn: { $lt: convertEndDate } }
            ]
        }).countDocuments({ paymentStatus: "failed" })
        allData['orderFailedCount'] = orderFailedCount
        console.log(allData);

        // totalPurchase
        var totalPurchase = await orderHistory.aggregate([
            {
                $match: {
                    $and: [
                        { addedOn: { $gte: convertStartDate } },
                        { addedOn: { $lt: convertEndDate } }
                    ]
                }
            },
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

        allData['totalPurchase'] = totalPurchase.length > 0 ? totalPurchase[0].totalRevenue : 0
        console.log(allData);
        return res.json({ data: allData, message: "adminDashboardData Fetched" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// deleteParticularProduct function
const deleteParticularProduct = async (req, res) => {
    try {
        var id = req.params.id;
        const data = await product.deleteOne({ _id: id });
        // console.log(data);
        return res.json({ data: data, message: "Product Deleted Successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

// addProduct function
const addProduct = async (req, res) => {
    const data = req.body;
    console.log(data, "===>");

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
}

// upateProduct function
const upateProduct = async (req, res) => {
    const data = req.body;
    const date = new Date();
    const imageFile = req.file;

    try {
        const getData = await product.findOne({ _id: data.id });

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

        await product.updateOne({  _id: data.id }, checkData);
        return res.json({ message: "Product Updated Successfully" });

    } catch (error) {
        return res.json({ message: error });
    }
}

// getFewData function
const getFewData = async (req, res) => {
    try {
        // const data = await product.find().limit(6);
        const data = await product.aggregate([
            { $match: { stock: { $gt: 0 } } },
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
        return res.json({ data: data, message: "productData Fetched" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// getSpecificProduct function
const getSpecificProduct = async (req, res) => {
    try {
        var id = req.params.id;
        const data = await product.findOne({ _id: id });
        // console.log(data);
        return res.json({ data: data, message: "productData Fetched" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// getAllProduct function
const getAllProduct = async (req, res) => {
    try {
        var categorySort = { stock: { $gt: 1 } }
        var priceSort = {}

        var page = parseInt(req.query.page) || 1;
        var limitItem = parseInt(req.query.count) || 5;
        const skipPage = (page - 1) * limitItem;

        console.log(page);
        console.log(limitItem);
        console.log(skipPage);

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
            priceSort._id = -1
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
        return res.json({ data: data, totalPage: totalProducts, message: "productData Fetched" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

// getMyProduct function
const getMyProduct = async (req, res) => {
    var userId = req.params.id
    console.log(new ObjectId(userId));


    try {
        var categorySort = { userId: new ObjectId(userId), stock: { $gt: 0 } };
        var priceSort = {}

        var page = parseInt(req.query.page) || 1;
        var limitItem = parseInt(req.query.count) || 5;
        const skipPage = (page - 1) * limitItem;

        console.log(page);
        console.log(limitItem);
        console.log(skipPage);


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
            priceSort = { _id: -1 }
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
        return res.json({ data: data, totalPage: totalProducts, message: "productData Fetched" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllProducts,
    getOneProduct,
    getAdminDashBoardDatas,
    deleteParticularProducts,
    addProducts,
    upateProducts,
    getFewData,
    getSpecificProduct,
    getAllProduct,
    getMyProduct,
    deleteParticularProduct,
    addProduct,
    upateProduct,
}