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


const generateRandomId = async () => {
    var generatedId;

    generatedId = Math.floor(100000 + Math.random() * 900000);
    return generatedId;
}

const sendMail = async (email, password) => {
    try {
        const result = await message.messages.create(process.env.mailGunDomainName, {
            from: "cartify@gmail.com",
            to: email,
            subject: "Password",
            text: "Welcome to Carify Thanks for Your Support",
            html: `
            <div>
                <h4>This is Your Password Login Using this ${password}</h4>
                <a href="http://localhost:3000/login">Login</a>
            </div> `
        });
        return result
    } catch (error) {
        return error
    }
}

const sendForgetPasswordMail = async (email, otp) => {
    try {
        const result = await message.messages.create(process.env.mailGunDomainName, {
            from: "cartify@gmail.com",
            to: email,
            subject: "Password",
            text: "Welcome to Carify Thanks for Your Support",
            html: `
            <div>
                <h4>This is Your OTP ${otp}</h4>
            </div> `
        });
        return result
    } catch (error) {
        return error
    }
}

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

            var generatedPassword = await generateRandomId()
            console.log(generatedPassword);

            var convertedStringPassword = String(generatedPassword)

            var sendPassword = await sendMail(data.email, convertedStringPassword)
            console.log(sendPassword.status);
            if (sendPassword.status === 200) {
                var hashPassword = await bcrypt.hash(convertedStringPassword, saltRounds);
                // console.log(hashPassword, "===>");

                await consumer.insertOne({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    mobile: data.mobile.replace(/\D/g, ""),
                    gender: data.gender,
                    password: hashPassword,
                    terms: data.terms,
                    role: "user",
                    status: "active",
                    images: imageFile.originalname,
                    address: data.address,
                    addedOn: date,
                    editedOn: date
                })
                return res.json({ message: "User Added Successfully and Password Send to Your Email" });
            }
            else {
                return res.json({ message: "User Added Failed and Password Failed to Send to Your Email" });
            }

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
        var generatedPassword = await generateRandomId()
        console.log(generatedPassword);

        var convertedStringPassword = String(generatedPassword)

        var sendPassword = await sendMail(data.email, convertedStringPassword)
        if (sendPassword.status === 200) {
            var hashPassword = await bcrypt.hash(convertedStringPassword, saltRounds);
            var updateData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: hashPassword,
                mobile: data.mobile.replace(/\D/g, ""),
                gender: data.gender,
                terms: data.terms,
                address: data.address,
                editedOn: new Date()
            };

            if (imageFile) {
                updateData.images = imageFile.originalname;
            }

            await consumer.updateOne(
                { email: data.email },
                { $set: updateData }
            );

            return res.json({ message: "User updated successfully and new password send to your email" });
        }
        else {
            return res.json({ message: "User updated failed and new password failed to send to your email" });
        }
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
            var generatedPassword = await generateRandomId()
            console.log(generatedPassword);

            var convertedStringPassword = String(generatedPassword)

            var sendPassword = await sendMail(data.email, convertedStringPassword)
            console.log(sendPassword.status);
            if (sendPassword.status === 200) {
                var hashPassword = await bcrypt.hash(convertedStringPassword, saltRounds);
                console.log(hashPassword, "===>");

                await consumer.insertOne({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    mobile: data.mobile.replace(/\D/g, ""),
                    gender: data.gender,
                    password: hashPassword,
                    terms: data.terms,
                    role: "user",
                    status: "active",
                    images: "",
                    address: data.address,
                    addedOn: date,
                    editedOn: date
                })
                return res.json({ message: "Signup Successfully and Password Send to Your Email" });
            }
            else {
                return res.json({ message: "Signup Failed and Password Failed to Send to Your Email" });
            }
        }
        else {
            return res.json({ message: "Email Already Exists, Please Use Another Email" });
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
        if (data.email && data.otp && data.password && data.confirmPassword) {
            const user = await consumer.findOne({ email: data.email });
            if (!user) {
                return res.json({ message: "Invalid credentials" });
            }

            if (Number(user.otp) === Number(data.otp)) {
                var hashPassword = await bcrypt.hash(data.password, saltRounds)
                const updatePassword = await consumer.updateOne({ email: data.email }, { $set: { password: hashPassword } });
                return res.json({ message: "Password reset success" });
            } else {
                return res.json({ message: "Invalid lastName" });
            }
        }
        else if (data.email && data.otp) {
            const user = await consumer.findOne({ email: data.email });
            if (!user) {
                return res.json({ message: "Invalid credentials" });
            }
            if (Number(user.otp) === Number(data.otp)) {
                return res.json({ message: "Validate success" });
            } else {
                return res.json({ message: "Invalid Otp" });
            }
        }
        else if (data.email) {
            const user = await consumer.findOne({ email: data.email });
            if (user) {
                var generatedOtp = await generateRandomId()
                console.log(generatedOtp);

                var sendPassword = await sendForgetPasswordMail(data.email, generatedOtp)
                console.log(sendPassword.status);
                if (sendPassword.status === 200) {
                    var updateOtp = await consumer.updateOne({ _id: user._id }, { $set: { otp: generatedOtp } })
                    return res.json({ message: "Otp send to your email" });
                }
                else {
                    return res.json({ message: "Otp failed to send to your email" });
                }
            } else {
                return res.json({ message: "Invalid credentials" });
            }
        }

    } catch (error) {
        return res.json({ message: "server error" });
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