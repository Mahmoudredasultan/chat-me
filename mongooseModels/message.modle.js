const mongoose = require("mongoose");
const currentDate = require("../utilites/current.Date.js");
const schema = mongoose.Schema({
    chatId: {
        type: String,
        required: [true, "you must put the chatId"]
    },
    sender: {
        type: String,
        required: [true, "you must put the sender"]
    },
    content: {
        type: String,
        required: [true, "put your mrssage"]
    },
    messageType: [{
        type: String,
        required: true,
        default: "TEXT",
        enum: ["TEXT", "VIDEO", "IMAGE"]
    }],
    messageStatus: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, "the messageStatus is required"]
    },
    timeSended: {
        type: String,
        default: currentDate(true)
    },
    link: {
        type: String
    },
    deleted: {
        type: Boolean,
        default: false
    }
});
const model = mongoose.model("Messages", schema);
module.exports = model;
