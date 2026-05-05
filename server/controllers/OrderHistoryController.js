const product = require('../models/ProductModel')

const cart = require('../models/CartModel')

const order = require('../models/OrderModel')

const orderHistory = require('../models/OrderHistoryModel')

const payment = require('../models/PaymentModel')

const { MongoClient, ObjectId } = require('mongodb');

const Stripe = require("stripe");

const validateStripe = Stripe(process.env.stripeSecretKey);

const placeOrder = async (req, res) => {
    try {
        const data = req.body.data;
        console.log(data, "===>");

        const address = req.body.address;
        console.log(address);

        const amount = req.body.totalAmount;
        console.log(amount);

        const date = new Date();
        

        const createEntry = await order.insertOne({
            userId: req.userId,
            status: "placed",
            shippingAddress: address,
            addedOn: date,
            editedOn: date
        });


        const orderId = createEntry._id;

        const createPaymentEntry = await payment.findOne().sort({ addedOn: -1 });
        console.log(createPaymentEntry, "---------------->");
        if (createPaymentEntry) {
            const updatePaymentEntry = await payment.updateOne({ _id: createPaymentEntry._id }, {
                $set: {
                    orderId: orderId,
                    editedOn: date
                }
            });
        }

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

        return res.json({ message: "order placed and payment success" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const paymentDetails = async (req, res) => {
    var date = new Date();
    try {
        const amount = req.body.totalAmount;

        const paymentIntent = await validateStripe.paymentIntents.create({
            amount: amount * 100,
            currency: "inr",
        });
        // console.log(paymentIntent, "==>");
        const createEntry = await payment.insertOne({
            paymentStatus: "paid",
            addedOn: date,
            editedOn: date
        })

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
        });
    }
}
module.exports = {
    placeOrder,
    paymentDetails
}