const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        defaultPrice: {
            type: Number,
            required: true
        },

        offer: {
            type: Number,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        stock: {
            type: Number,
            default: 0
        },

        color: {
            type: String,
            required: true
        },

        size: {
            type: String,
            required: true
        },

        image: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },
        rating: {
            type: Number
        },
        addedOn: {
            type: Date,
            default: null
        },
        editedOn: {
            type: Date,
            default: null
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    }
);

const product = mongoose.model("Product", productSchema);
module.exports = product;