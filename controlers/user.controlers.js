const users = require("../mongooseModels/mongoose.models.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utilites/AppError.js");
const asyncWraper = require("../middel-weres/asyncWraper.js");
require("dotenv").config();
const validator = require("validator");
const getAllUsers = asyncWraper(async (req, res, next) => {
    getUsers = await users.find();
    res.json({
        status: "success",
        data: getUsers
    });
});

const postUser = asyncWraper(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    console.log(req.body);
    if (!password) {
        const error = AppError.create(
            "you must inter your password",
            500,
            "error"
        );
        return next(error);
    }
    const hashPassowrd = await bcrypt.hash(password, 10);
    console.log(hashPassowrd);
    adduser = await new users({
        name,
        email,
        role,
        password: hashPassowrd,
        avatar: req.file ? req.file.path : "null"
    });
    await adduser.save();

    const token = jwt.sign({ name, email }, process.env.secrit_key);

    res.status(201).json({ status: "success", data: {...adduser._doc, token } });
});

const login = asyncWraper(async (req, res, next) => {
    let { email, password } = req.body;
    const trueEmail = validator.isEmail(email);
    if (!trueEmail) {
        const error1 = AppError.create(
            "this email is not true check your email",
            500,
            "error"
        );
        return next(error1);
    }
    const account = await users.findOne({ email });
    console.log(email, password);
    if (!email || !password) {
        const er = AppError.create(
            "this data is not accepted please check your email or password",
            500,
            "error"
        );
        return next(er);
    }
    console.log(account);
    if (!account) {
        const error = AppError.create(
            "ther,s no account by that email",
            500,
            "error"
        );
        return next(error);
    }
    const virefy = await bcrypt.compare(password, account.password);
    console.log(virefy);
    if (!virefy) {
        const err = AppError.create("this password is not true", 500, "error");
        return next(err);
    }
    const { name, role } = account;
    const tok = jwt.sign(
        { name, email: account.email, role },
        process.env.secrit_key
    );
    res.json({ status: "success", data: { tok } });
});
module.exports = { getAllUsers, postUser, login };
