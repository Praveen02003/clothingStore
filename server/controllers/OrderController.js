const product = require('../models/ProductModel')

const cart = require('../models/CartModel')

const order = require('../models/OrderModel')

const orderHistory = require('../models/OrderHistoryModel')

const consumer = require('../models/ConsumerModel')

const { MongoClient, ObjectId } = require('mongodb');

const logger = require('../logger/Logger.js')

// updateOrderStatus function
const updateOrderStatus = async (req, res) => {
    try {
        const data = req.body.data;

        const findOrder = await order.findOne({ orderId: data.id });
        if (findOrder) {
            var uodateOrder = await order.updateOne({ orderId: data.id }, { $set: { status: data.status } })
        }
        else if (!findOrder) {

            logger.info("data not found", {
                functionName: "updateOrderStatus",
                userId: req.userId,
            });

            return res.status(404).json({ message: "data not found" });
        }

        logger.info("status updated successfully", {
            functionName: "updateOrderStatus",
            userId: req.userId,
        });

        return res.json({ message: "status updated successfully" });

    } catch (error) {

        logger.error(error, {
            functionName: "updateOrderStatus",
            userId: req.userId,
        });

        return res.status(500).json({ error: error.message });
    }
}

// deleteOrder function
const deleteOrder = async (req, res) => {
    try {
        const data = req.body.data;

        const findOrder = await order.findOne({ orderId: data.id });
        if (findOrder) {
            var findOrderHistory = await orderHistory.find({ orderId: data.id })
            console.log(findOrderHistory);
            for (const element of findOrderHistory) {
                var findProduct = await product.findOne({ _id: element.productId })
                var updateQuantity = findProduct.stock + element.quantity
                var updateProduct = await product.updateOne({ _id: element.productId }, { $set: { stock: updateQuantity } })
            }

            var deleteOrderHistory = await orderHistory.deleteOne({ orderId: data.id })
            var deleteOrder = await order.deleteOne({ orderId: data.id })
        }
        else if (!findOrder) {

            logger.info("data not found", {
                functionName: "deleteOrder",
                userId: req.userId,
            });

            return res.status(404).json({ message: "data not found" });
        }

        logger.info("order deleted successfully", {
            functionName: "deleteOrder",
            userId: req.userId,
        });

        return res.json({ message: "order deleted successfully" });

    } catch (error) {

        logger.error(error, {
            functionName: "deleteOrder",
            userId: req.userId,
        });

        return res.status(500).json({ error: error.message });
    }
}

// getMyOrders function
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
                    localField: "orderId",
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
            },
            {
                $lookup: {
                    from: "payments",
                    localField: "orderId",
                    foreignField: "orderId",
                    as: "paymentData"
                }
            },
            { $sort: { addedOn: -1 } },
            { $skip: skipPage },
            { $limit: limitItem }
        ]);
        console.log(getOrders);

        const totalOrders = await order.countDocuments({ userId: new ObjectId(userId) });

        logger.info("orderData fetched", {
            functionName: "getMyOrders",
            userId: req.userId,
        });

        return res.json({ message: "orderData fetched", data: getOrders, totalPage: totalOrders });

    } catch (error) {

        logger.error(error, {
            functionName: "getMyOrders",
            userId: req.userId,
        });

        return res.status(500).json({ message: error.message });
    }
}

// getAllOrders function
const getAllOrders = async (req, res) => {
    try {

        var page = parseInt(req.query.page) || 1;
        var limitItem = parseInt(req.query.count) || 5;
        const skipPage = (page - 1) * limitItem;

        var getOrders = await order.aggregate([
            {
                $lookup: {
                    from: "orderhistories",
                    localField: "orderId",
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
            },
            {
                $lookup: {
                    from: "payments",
                    localField: "orderId",
                    foreignField: "orderId",
                    as: "paymentData"
                }
            },
            { $sort: { addedOn: -1 } },
            { $skip: skipPage },
            { $limit: limitItem }
        ]);
        console.log(getOrders);

        const totalOrders = await order.countDocuments();

        logger.info("orderData fetched", {
            functionName: "getAllOrders",
            userId: req.userId,
        });

        return res.json({ message: "orderData fetched", data: getOrders, totalPage: totalOrders });

    } catch (error) {
        logger.error(error, {
            functionName: "getAllOrders",
            userId: req.userId,
        });
        return res.status(500).json({ message: error.message });
    }
}

// getParticularOrderAdmin function
const getParticularOrderAdmin = async (req, res) => {
    try {
        const orderId = req.params.id;
        console.log(orderId);


        var page = parseInt(req.query.page) || 1;
        var limitItem = parseInt(req.query.count) || 5;
        const skipPage = (page - 1) * limitItem;

        var getOrders = await order.aggregate([
            {
                $match: {
                    orderId: orderId
                }
            },
            {
                $lookup: {
                    from: "orderhistories",
                    localField: "orderId",
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
            },
            {
                $lookup: {
                    from: "payments",
                    localField: "orderId",
                    foreignField: "orderId",
                    as: "paymentData"
                }
            },
            { $sort: { addedOn: -1 } },
            { $skip: skipPage },
            { $limit: limitItem }
        ]);
        console.log(getOrders);

        const totalOrders = await order.countDocuments({ orderId: orderId });

        logger.info("orderData fetched", {
            functionName: "getParticularOrderAdmin",
            userId: req.userId,
        });

        return res.json({ message: "orderData fetched", data: getOrders, totalPage: totalOrders });

    } catch (error) {
        logger.error(error, {
            functionName: "getParticularOrderAdmin",
            userId: req.userId,
        });
        return res.status(500).json({ message: error.message });
    }
}

// getParticularOrder function
const getParticularOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        console.log(orderId);


        var page = parseInt(req.query.page) || 1;
        var limitItem = parseInt(req.query.count) || 5;
        const skipPage = (page - 1) * limitItem;

        var getOrders = await order.aggregate([
            {
                $match: {
                    orderId: orderId
                }
            },
            {
                $lookup: {
                    from: "orderhistories",
                    localField: "orderId",
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
            },
            {
                $lookup: {
                    from: "payments",
                    localField: "orderId",
                    foreignField: "orderId",
                    as: "paymentData"
                }
            },
            { $sort: { addedOn: -1 } },
            { $skip: skipPage },
            { $limit: limitItem }
        ]);
        console.log(getOrders);

        const totalOrders = await order.countDocuments({ orderId: orderId });

        logger.info("orderData fetched", {
            functionName: "getParticularOrder",
            userId: req.userId,
        });

        return res.json({ message: "orderData fetched", data: getOrders, totalPage: totalOrders });

    } catch (error) {

        logger.error(error, {
            functionName: "getParticularOrder",
            userId: req.userId,
        });

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