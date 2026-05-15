const mongoose = require('mongoose');

// paymentModel
const paymentSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        paymentIntentId: {
            type: String,
            required: false
        },
        paymentMethodId: {
            type: String,
            required: false
        },
        originalAmount: {
            type: Number,
            required: false
        },
        totalAmount: {
            type: Number,
            required: false
        },
        currency: {
            type: String,
            required: false
        },
        paymentStatus: {
            type: String,
            required: false
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