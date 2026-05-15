const mongoose = require("mongoose");

// connectDb function
const connectDb = async () => {
    try {
        const url = process.env.dbUrl || 'mongodb://localhost:27017/clothingStore';
        await mongoose.connect(url);

        console.log("connected");
        // console.log(url);

    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDb;