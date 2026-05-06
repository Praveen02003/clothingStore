const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        uniqueId: {
            type: Number,
            default: true
        },
        paymentStatus: {
            type: String,
            required: true
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