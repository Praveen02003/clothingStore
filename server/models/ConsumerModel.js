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
        securityQuestion: {
            type: String,
            required: true
        },
        securityAnswer: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        images: {
            type: String
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
consumerSchema.index({ email: 1 });

const consumer = mongoose.model("Consumer", consumerSchema);
module.exports = consumer;