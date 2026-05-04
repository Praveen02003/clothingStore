const product = require('../models/ProductModel')

const cart = require('../models/CartModel')

const order = require('../models/OrderModel')

const orderHistory = require('../models/OrderHistoryModel')

const { MongoClient, ObjectId } = require('mongodb');

const placeOrder = async (req, res) => {
    try {
        const data = req.body.data;
        console.log(data, "===>");

        const address = req.body.address;
        console.log(address);

        const date = new Date();

        const createEntry = await order.create({
            userId: req.userId,
            status: "placed",
            shippingAddress: address,
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
}
module.exports = {
    placeOrder
}