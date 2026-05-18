const product = require('../models/ProductModel')

const cart = require('../models/CartModel')

const order = require('../models/OrderModel')

const orderHistory = require('../models/OrderHistoryModel')

const consumer = require('../models/ConsumerModel')

const { MongoClient, ObjectId } = require('mongodb');

// updateCartQuantity function
const updateCartQuantity = async (req, res) => {
    try {
        const data = req.body.data;
        const cartId = data.cartId;
        const quantity = Number(data.quantity);

        const findData = await cart.findById(cartId);

        if (!findData) {
            return res.json({ message: "CartItems not found" });
        }
        var productId = findData.productId

        const findProduct = await product.findOne({ _id: productId });

        if (!findProduct) {
            return res.json({ message: "product not found" });
        }

        if (quantity > findProduct.stock) {
            return res.json({
                message: `Only ${findProduct.stock} items available`
            });
        }

        await cart.updateOne(
            { _id: cartId },
            {
                $set: {
                    quantity: quantity,
                    editedOn: new Date()
                }
            }
        );

        return res.json({ message: "quantity updated success" });

    } catch (error) {

        return res.status(500).json({ message: error.message });
    }
}

// removeFromCart function
const removeFromCart = async (req, res) => {
    try {

        var cartId = req.params.id

        var findData = await cart.findOne({ _id: cartId })
        if (findData) {
            await cart.deleteOne({ _id: cartId })
            return res.json({ message: "item deleted successfully" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// cartAdd function
const cartAdd = async (req, res) => {
    console.log("hi");
    console.log(req,"========================>");

    try {
        const data = req.body.data;
        console.log(data)

        var date = new Date()

        var userId = data.userId
        var productId = data.productId

        const existingProduct = await cart.findOne({
            $and: [
                { userId: userId },
                { productId: productId }
            ]
        });
        console.log(existingProduct, "====>")


        if (existingProduct) {
            await cart.deleteOne({ _id: existingProduct._id });
            return res.json({ message: "Product removed from cart" });
        } else {
            await cart.insertOne({
                userId: userId,
                productId: productId,
                quantity: 1,
                addedOn: date,
                editedOn: date
            });
            return res.json({ message: "Product added to cart" });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// getCartData function
const getCartData = async (req, res) => {
    try {
        const data = req.body.data;
        console.log(data)


        var userId = data.userId

        const findProduct = await cart.find({ userId: userId }, { productId: 1, _id: 0 });
        console.log(findProduct, "====>")
        var newArray = []
        findProduct.forEach(element => {
            newArray.push(element.productId)
        });
        return res.json({ message: "cartData fetched", data: newArray });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// getCart function
const getCart = async (req, res) => {
    try {
        const data = req.params.id;
        console.log(data)


        var userId = data

        const datas = await cart.aggregate([
            { $match: { userId: new ObjectId(userId) } },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $lookup: {
                    from: "consumers",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            }
        ]);

        return res.json({ message: "cartData fetched", data: datas });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    updateCartQuantity,
    removeFromCart,
    cartAdd,
    getCartData,
    getCart
}