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
            type: Number
        },

        offer: {
            type: Number
        },

        description: {
            type: String
        },

        stock: {
            type: Number,
            default: 0
        },

        colors: [
            {
                type: String
            }
        ],

        sizes: [
            {
                type: String
            }
        ],

        images: [
            {
                type: String
            }
        ],

        category: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const product = mongoose.model("Product", productSchema,"products");
module.exports = product;