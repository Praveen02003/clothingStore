const product = require('../models/ProductModel')

const cart = require('../models/CartModel')

const order = require('../models/OrderModel')

const orderHistory = require('../models/OrderHistoryModel')

const consumer = require('../models/ConsumerModel')

const { MongoClient, ObjectId } = require('mongodb');

const updateOrderStatus = async (req, res) => {
    try {
        const data = req.body.data;

        const findOrder = await order.findOne({ uniqueId: data.id });
        if (findOrder) {
            var uodateOrder = await order.updateOne({ uniqueId: data.id }, { $set: { status: data.status } })
        }
        else if (!findOrder) {
            return res.status(404).json({ message: "data not found" });
        }

        return res.json({ message: "status updated successfully" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


const deleteOrder = async (req, res) => {
    try {
        const data = req.body.data;

        const findOrder = await order.findOne({ uniqueId: data.id });
        if (findOrder) {
            var findOrderHistory = await orderHistory.find({ uniqueId: data.id })
            console.log(findOrderHistory);
            for (const element of findOrderHistory) {
                var findProduct = await product.findOne({ _id: element.productId })
                var updateQuantity = findProduct.stock + element.quantity
                var updateProduct = await product.updateOne({ _id: element.productId }, { $set: { stock: updateQuantity } })
            }

            var deleteOrderHistory = await orderHistory.deleteOne({ uniqueId: data.id })
            var deleteOrder = await order.deleteOne({ uniqueId: data.id })
        }
        else if (!findOrder) {
            return res.status(404).json({ message: "data not found" });
        }

        return res.json({ message: "order deleted successfully" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


const getMyOrders = async (req, res) => {
    try {
        const userId = req.params.id;

        var page = parseInt(req.query.page) || 1;
        var limitItem = parseInt(req.query.count) || 5;
        const skipPage = (page - 1) * limitItem;

        var getOrders = await order.aggregate([
            {
                $match: {
                    userId: new ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "orderhistories",
                    localField: "uniqueId",
                    foreignField: "uniqueId",
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
            },
            {
                $lookup: {
                    from: "payments",
                    localField: "uniqueId",
                    foreignField: "uniqueId",
                    as: "paymentData"
                }
            },
            { $sort: { addedOn: -1 } },
            { $skip: skipPage },
            { $limit: limitItem }
        ]);
        console.log(getOrders);

        const totalOrders = await order.countDocuments({ userId: new ObjectId(userId) });


        return res.json({ message: "data fetched", data: getOrders, totalPage: totalOrders });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


const getAllOrders = async (req, res) => {
    try {

        var page = parseInt(req.query.page) || 1;
        var limitItem = parseInt(req.query.count) || 5;
        const skipPage = (page - 1) * limitItem;

        var getOrders = await order.aggregate([
            {
                $lookup: {
                    from: "orderhistories",
                    localField: "uniqueId",
                    foreignField: "uniqueId",
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
            },
            {
                $lookup: {
                    from: "payments",
                    localField: "uniqueId",
                    foreignField: "uniqueId",
                    as: "paymentData"
                }
            },
            { $sort: { addedOn: -1 } },
            { $skip: skipPage },
            { $limit: limitItem }
        ]);
        console.log(getOrders);

        const totalOrders = await order.countDocuments();


        return res.json({ message: "data fetched", data: getOrders, totalPage: totalOrders });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


const getParticularOrderAdmin = async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        console.log(orderId);


        var page = parseInt(req.query.page) || 1;
        var limitItem = parseInt(req.query.count) || 5;
        const skipPage = (page - 1) * limitItem;

        var getOrders = await order.aggregate([
            {
                $match: {
                    uniqueId: orderId
                }
            },
            {
                $lookup: {
                    from: "orderhistories",
                    localField: "uniqueId",
                    foreignField: "uniqueId",
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
            },
            {
                $lookup: {
                    from: "payments",
                    localField: "uniqueId",
                    foreignField: "uniqueId",
                    as: "paymentData"
                }
            },
            { $sort: { addedOn: -1 } },
            { $skip: skipPage },
            { $limit: limitItem }
        ]);
        console.log(getOrders);

        const totalOrders = await order.countDocuments({ uniqueId: orderId });


        return res.json({ message: "data fetched", data: getOrders, totalPage: totalOrders });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const getParticularOrder = async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        console.log(orderId);


        var page = parseInt(req.query.page) || 1;
        var limitItem = parseInt(req.query.count) || 5;
        const skipPage = (page - 1) * limitItem;

        var getOrders = await order.aggregate([
            {
                $match: {
                    uniqueId: orderId
                }
            },
            {
                $lookup: {
                    from: "orderhistories",
                    localField: "uniqueId",
                    foreignField: "uniqueId",
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
            },
            {
                $lookup: {
                    from: "payments",
                    localField: "uniqueId",
                    foreignField: "uniqueId",
                    as: "paymentData"
                }
            },
            { $sort: { addedOn: -1 } },
            { $skip: skipPage },
            { $limit: limitItem }
        ]);
        console.log(getOrders);

        const totalOrders = await order.countDocuments({ uniqueId: orderId });


        return res.json({ message: "data fetched", data: getOrders, totalPage: totalOrders });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
module.exports = {
    updateOrderStatus,
    deleteOrder,
    getMyOrders,
    getAllOrders,
    getParticularOrder,
    getParticularOrderAdmin
}