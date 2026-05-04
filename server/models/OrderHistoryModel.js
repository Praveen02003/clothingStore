const mongoose = require('mongoose');

const orderHistorySchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        },
        totalPrice: {
            type: Number,
            default: 0
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

const orderHistory = mongoose.model("OrderHistory", orderHistorySchema);
module.exports = orderHistory;