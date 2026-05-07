const product = require('../models/ProductModel')

const cart = require('../models/CartModel')

const order = require('../models/OrderModel')

const orderHistory = require('../models/OrderHistoryModel')

const payment = require('../models/PaymentModel')

const { MongoClient, ObjectId } = require('mongodb');

const Stripe = require("stripe");

const validateStripe = Stripe(process.env.stripeSecretKey);


const generateRandomId = async () => {
    var boolean = true;
    var generatedId;

    while (boolean) {
        generatedId = Math.floor(100000 + Math.random() * 900000);
        var findId = await order.findOne({ uniqueId: generatedId })

        if (findId) {
            boolean = true
        }
        else {
            boolean = false
            return generatedId;
        }
    }
}

const placeOrder = async (req, res) => {
    try {
        const data = req.body.data;
        console.log(data, "===>");

        const address = req.body.address;
        console.log(address);

        const amount = req.body.totalAmount;
        console.log(amount);

        var paymentIntentDetails = req.body.paymentIntentDetails;
        console.log(paymentIntentDetails, "======>");


        const date = new Date();

        var orderId = await generateRandomId()


        const createPaymentEntry = await payment.insertOne({
            orderId: orderId,
            userId: req.userId,
            paymentIntentId: paymentIntentDetails.id,
            paymentMethodId: paymentIntentDetails.payment_method,
            totalAmount: paymentIntentDetails.amount,
            currency: paymentIntentDetails.currency,
            status: paymentIntentDetails.status,
            paymentStatus: "paid",
            originalAmount: amount,
            addedOn: date,
            editedOn: date
        });

        const createEntry = await order.insertOne({
            orderId: orderId,
            userId: req.userId,
            status: "placed",
            shippingAddress: address,
            addedOn: date,
            editedOn: date
        });

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
        console.log(error);

        return res.status(500).json({ message: error.message });
    }
}

const failedOrder = async (req, res) => {
    try {
        var generateRandomNumber;
        const data = req.body.data;
        console.log(data, "===>");

        const address = req.body.address;
        console.log(address);

        var paymentIntentDetails = req.body.paymentIntentDetails;
        console.log(paymentIntentDetails);

        const amount = req.body.totalAmount;
        console.log(amount);

        const date = new Date();

        var orderId = await generateRandomId()

        const createEntry = await order.insertOne({
            orderId: orderId,
            userId: req.userId,
            status: "cancelled",
            shippingAddress: address,
            addedOn: date,
            editedOn: date
        });

        const createPaymentEntry = await payment.insertOne({
            orderId: orderId,
            userId: req.userId,
            paymentIntentId: paymentIntentDetails?.id || "",
            paymentMethodId: paymentIntentDetails?.payment_method || "",
            totalAmount: paymentIntentDetails?.amount || 0,
            originalAmount: amount,
            currency: paymentIntentDetails?.currency || "",
            status: paymentIntentDetails?.status || "failed",
            paymentStatus: "failed",
            addedOn: date,
            editedOn: date
        });


        for (const element of data) {
            var id = element.productId
            const findProduct = await product.findOne({ _id: id });

            if (element.quantity > findProduct.stock) {
                return res.json({ message: "Insufficient stock" });
            }
            await orderHistory.insertOne({
                orderId: orderId,
                productId: element.productId,
                quantity: element.quantity,
                totalPrice: findProduct.price * element.quantity,
                addedOn: date,
                editedOn: date
            });
        }

        return res.json({ message: "payment failed" });

    } catch (error) {
        console.log(error);

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
            automatic_payment_methods: {
                enabled: true,
            },
        });
        console.log(paymentIntent, "==>");

        return res.json({
            id: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            message: error.message,
        });
    }
}

module.exports = {
    placeOrder,
    paymentDetails,
    failedOrder
}