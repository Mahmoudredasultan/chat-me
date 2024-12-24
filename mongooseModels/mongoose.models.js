const mongoose = require("mongoose");
const validator = require("validator");
const roles = require("../utilites/roles.js");
require("dotenv").config();
mongoose
    .connect(
        process.env.data_base
    )
    .then(() => {
        console.log("good conection");
    })
    .catch(err => {
        console.log("conection lost : " + err.message);
    });
const schema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "you must inter your name"],
        unique: [true, "this name is acualy used"]
    },
    email: {
        type: String,
        required: [true, "you must inter your email"],
        validate: [validator.isEmail, "you must inter the true email"],
        unique: [true, "this email is oridy exist"]
    },
    avatar:{
      type:String,
      default:"/upload/images/avatar.PNG",
      required:true
    },
    password: {
        type: String,
        required: [true, "you mast inter your password"]
    },
    role: {
        type: String,
        enum: [roles.MANGER, roles.ADMIN, roles.USER],
        default: roles.USER
    }
});
const model = mongoose.model("Users", schema);
module.exports = model;
