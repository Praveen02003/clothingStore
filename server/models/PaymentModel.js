const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        orderId: {
            type: Number,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        paymentIntentId: {
            type: String,
        },
        paymentMethodId: {
            type: String,
        },
        originalAmount: {
            type: Number,
        },
        totalAmount: {
            type: Number,
        },
        currency: {
            type: String,
        },
        paymentStatus: {
            type: String,
        },
        addedOn: {
            type: Date,
            default: null
        },
        editedOn: {
            type: Date,
            default: null
        }
    }
);

const payment = mongoose.model("Payment", paymentSchema);
module.exports = payment;