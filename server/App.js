const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const dotenv = require('dotenv');

const connectDb = require('./config/Db');

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());

var port = process.env.PORT || 5000;

// connectDb function
connectDb();

app.use("/images", express.static("public/images"));

// routes
app.use("/api/consumers", require("./routes/ConsumerRoutes"));
app.use("/api/products", require("./routes/ProductRoutes"));
app.use("/api/carts", require("./routes/CartRoutes"));
app.use("/api/orders", require("./routes/OrderRoutes"));
app.use("/api/orderHistory", require("./routes/OrderHistoryRoutes"));

app.listen(port, () => {
    console.log(`server running at port ${port}`);
});