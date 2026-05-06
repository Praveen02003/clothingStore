const product = require('../models/ProductModel')

const cart = require('../models/CartModel')

const order = require('../models/OrderModel')

const orderHistory = require('../models/OrderHistoryModel')

const consumer = require('../models/ConsumerModel')

const { MongoClient, ObjectId } = require('mongodb');

const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { default: axios } = require('axios')

const formData = require("form-data");
const Mailgun = require("mailgun.js");

const mailgun = new Mailgun(formData);

const message = mailgun.client({
    username: "PraveenTech",
    key: process.env.mailGunApiKey,
});


var secretKey = process.env.JWT_SECRET_KEY
var captchaSecretKey = process.env.captchaSecretKey

const getAllConsumers = async (req, res) => {
    var page = parseInt(req.query.page) || 1;
    var limitItem = parseInt(req.query.count) || 5;
    var status = req.query.category;

    var searchData = req.query.search;
    console.log(searchData, "====>");

    var categorySort = { role: "user" };

    if (searchData) {
        categorySort.$or = [
            { firstName: { $regex: searchData, $options: "i" } },
            { email: { $regex: searchData, $options: "i" } },
        ];
    }
    else if (status) {
        categorySort.status = status
    }

    const skipPage = (page - 1) * limitItem;
    try {
        const allConsumers = await consumer.find(categorySort).sort({ addedOn: -1 }).skip(skipPage).limit(limitItem);
        const totalConsumers = await consumer.countDocuments(categorySort);
        console.log(allConsumers);
        return res.json({ data: allConsumers, totalPage: totalConsumers, message: "Data Fetched" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


const getOneConsumer = async (req, res) => {
    try {
        const id = req.params.id
        const getOneConsumer = await consumer.findOne({ _id: id });
        console.log(getOneConsumer);
        return res.json({ data: getOneConsumer, message: "Data Fetched" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


const addUser = async (req, res) => {
    const data = req.body;
    const date = new Date();
    const saltRounds = 12;
    const imageFile = req.file;
    try {
        var getData = await consumer.findOne({ email: data.email })
        // console.log(getData);
        if (!getData) {
            var hashPassword = await bcrypt.hash(data.password, saltRounds);
            // console.log(hashPassword, "===>");

            await consumer.insertOne({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                mobile: data.mobile,
                gender: data.gender,
                password: hashPassword,
                terms: data.terms,
                role: "user",
                status: "active",
                images: imageFile.originalname,
                address: data.address,
                securityQuestion: data.securityQuestion,
                securityAnswer: data.securityAnswer,
                addedOn: date,
                editedOn: date
            })
            return res.json({ message: "User Added Successfully" });
        }
        else {
            return res.json({ message: "User Already Exists" });
        }
    } catch (error) {
        return res.json({ message: "User Added Failed", data: error });
    }
}


const getAddressDetails = async (req, res) => {
    try {
        var userId = req.params.id
        var findData = await consumer.findOne({ _id: userId })
        console.log(findData);

        if (findData) {
            return res.json({ message: "data fetched", data: findData });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


const updateUser = async (req, res) => {
    const data = req.body;
    console.log(data);

    const saltRounds = 12;
    const imageFile = req.file;

    try {
        const existingUser = await consumer.findOne({ email: data.email });

        if (!existingUser) {
            return res.json({ message: "User not found" });
        }

        var updateData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            mobile: data.mobile,
            gender: data.gender,
            terms: data.terms,
            address: data.address,
            securityQuestion: data.securityQuestion,
            securityAnswer: data.securityAnswer,
            editedOn: new Date()
        };
        if (imageFile) {
            updateData.image = imageFile.filename;
        }

        if (data.newPassword && data.confirmPassword) {
            const hashPassword = await bcrypt.hash(data.newPassword, saltRounds);
            updateData.password = hashPassword;
        }
        if (imageFile) {
            updateData.images = imageFile.originalname;
        }

        await consumer.updateOne(
            { email: data.email },
            { $set: updateData }
        );

        return res.json({ message: "User updated successfully" });

    } catch (error) {
        return res.json({ message: error.message });
    }
}


const addUsers = async (req, res) => {
    const data = req.body.data;
    const date = new Date();
    const saltRounds = 12;
    try {
        var getData = await consumer.findOne({ email: data.email })
        // console.log(getData);
        if (!getData) {
            var hashPassword = await bcrypt.hash(data.password, saltRounds);
            // console.log(hashPassword, "===>");

            await consumer.insertOne({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                mobile: data.mobile,
                gender: data.gender,
                password: hashPassword,
                terms: data.terms,
                role: "user",
                status: "active",
                images: "",
                address: data.address,
                securityQuestion: data.securityQuestion,
                securityAnswer: data.securityAnswer,
                addedOn: date,
                editedOn: date
            })
            return res.json({ message: "Signup Successfully" });
        }
        else {
            return res.json({ message: "Email Already Exists" });
        }
    } catch (error) {
        console.log(error);

        return res.json({ message: "error" });
    }
}


const loginUser = async (req, res) => {
    const data = req.body.data;
    console.log(data, "==>");
    var enteredCaptcha = data?.captcha;

    try {
        var verifyCaptcha = await axios.post(`${process.env.verifyCaptchaUrl}?secret=${captchaSecretKey}&response=${enteredCaptcha}`)
        console.log(verifyCaptcha?.data?.success);
        var successMessage = verifyCaptcha?.data?.success
        if (successMessage) {
            var getData = await consumer.findOne({ email: data.email })
            // console.log(getData);
            if (getData) {
                var comparePassword = await bcrypt.compare(data.password, getData.password);
                // console.log(comparePassword, "===>");
                if (comparePassword) {
                    var generateToken = jwt.sign({ userId: getData._id, role: getData.role }, secretKey, {
                        expiresIn: '1h',
                    });
                    return res.json({ message: "Login Successfully", data: getData, token: generateToken });
                }
                else {
                    return res.json({ message: "Password Mismatch" });
                }
            }
            else {
                return res.json({ message: "Invalid Credentials" });
            }
        }
    } catch (error) {
        return res.json({ message: "error" });
    }
}


const forgetPassword = async (req, res) => {
    const data = req.body?.data;
    console.log(data);
    const saltRounds = 12;

    try {
        if (data.email && data.securityAnswerType && data.password && data.confirmPassword) {
            const user = await consumer.findOne({ email: data.email });
            if (!user) {
                return res.json({ message: "Invalid credentials" });
            }

            if (user.securityAnswer.toLowerCase() === data.securityAnswerType.toLowerCase()) {
                var hashPassword = await bcrypt.hash(data.password, saltRounds)
                const updatePassword = await consumer.updateOne({ email: data.email }, { $set: { password: hashPassword } });
                return res.json({ message: "Password reset success" });
            } else {
                return res.json({ message: "Invalid lastName" });
            }
        }
        else if (data.email && data.securityAnswerType) {
            const user = await consumer.findOne({ email: data.email });
            if (!user) {
                return res.json({ message: "Invalid credentials" });
            }
            if (user.securityAnswer.toLowerCase() === data.securityAnswerType.toLowerCase()) {
                return res.json({ message: "Validate success" });
            } else {
                return res.json({ message: "Invalid answer" });
            }
        }
        else if (data.email) {
            const user = await consumer.findOne({ email: data.email });
            if (user) {
                return res.json({ message: "Data present", data: user });
            } else {
                return res.json({ message: "Invalid credentials" });
            }
        }

    } catch (error) {
        return res.json({ message: "server error" });
    }
}


const sendMail = async (req, res) => {
    try {
        const result = await message.messages.create(process.env.mailGunDomainName, {
            from: "gngdbndfgbdfpraveenjp7557@gmail.com",
            to: 'praveen.aeropilot@gmail.com',
            subject: "vanakkam",
            text: "welcome"
        });

        console.log("result", result);
        return res.json({ message: "Email send success" })
    } catch (error) {
        console.log("error", error);
        return res.json({ message: "Email send failed" })

    }
}

module.exports = {
    getAllConsumers,
    getOneConsumer,
    addUser,
    getAddressDetails,
    updateUser,
    addUsers,
    loginUser,
    forgetPassword,
    sendMail
}