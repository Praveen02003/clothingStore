const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        quantity: {
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

const cart = mongoose.model("Cart", cartSchema);
module.exports = cart;