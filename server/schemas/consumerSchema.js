const mongoose = require('mongoose');

const consumerSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        terms: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },

        images: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const consumer = mongoose.model("Consumer", consumerSchema, "consumers");
module.exports = consumer;