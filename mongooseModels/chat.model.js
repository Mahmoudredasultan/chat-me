const mongoose = require("mongoose");
const newDate = require("../utilites/current.Date.js");
const schema = mongoose.Schema({
    participants: [
        {
            type: String,
            require: true
        }
    ],
    admins:[{
      type:String
    }],
    chatType: {
        type: String,
        required: true,
        enum: ["GROUP", "SINGLE"]
    },
    lastMessage: {
        type: String,
        default: "no message with this frind",
        required: true
    },
    createdAt: {
        type: String,
        default: newDate(false)
    },
    updatedAt: {
        type: String,
        default: newDate(true)
    }
});
const model = mongoose.model("Chats", schema);
module.exports = model;
