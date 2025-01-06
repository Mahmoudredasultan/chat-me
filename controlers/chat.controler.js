const chatModle = require("../mongooseModels/chat.model.js");
//hi
const userModle = require("../mongooseModels/mongoose.models.js");
const asyncWraper = require("../middel-weres/asyncWraper.js");
const AppError = require("../utilites/AppError.js");
const jwt = require("jsonwebtoken");
const getChat = asyncWraper(async (req, res, next) => {
    console.log(req.data);
    const name = req.data.name;
    const chates = await chatModle.find({ participants: name });
    console.log(name, chates);
    res.json({ status: "success", data: chates });
});

const postChat = asyncWraper(async (req, res, next) => {
    const { participants, chatType, admins, chatName } = req.body;
    if (participants.length > 2 && chatType === "SINGLE") {
        const error = AppError.create(
            "this chat must to be with single pirson",
            404,
            "fail"
        );
        return next(error);
    }
    if (participants.length === 2 && chatType === "GROUP") {
        const err = AppError.create(
            "this chat must be agroup chat",
            404,
            "fail"
        );
        return next(err);
    }
    if (participants.length < 2) {
        const er = AppError.create(
            "the participants musb be equal or greater than << 2 >>",
            404,
            "fail"
        );
        return next(er);
    }
    for (let i = 0; i < participants.length; i++) {
        const user = await userModle.findOne({ name: participants[i] });
        if (!user) {
            const er2 = AppError.create(
                `the user ${participants[i]} is not exist`,
                404,
                "fail"
            );
            return next(er2);
        }
    }
    if (chatType === "GROUP" && !admins) {
        const er = AppError.create(
            "you must add the admins in this group",
            404,
            "fail"
        );
        return next(er);
    }
    if (chatType === "GROUP" && admins) {
        for (let i = 0; i < admins.length; i++) {
            const check = participants.find(el => el === admins[i]);

            if (!check) {
                const er5 = AppError.create(
                    "this admin is not exist in this group",
                    401,
                    "fail"
                );
                return next(er5);
            }
        }
    }
    if (chatType === "GROUP" && !chatName) {
        const error = AppError.create("ther's no group name", 404, "fail");
        return next(error);
    }
    const checkChat = await chatModle.findOne({ participants });
    if (checkChat) {
        const myer = AppError.create("this chat is oridy exsist ", 404, "fail");
        return next(myer);
    }
    const addChat = new chatModle({
        participants,
        chatType,
        admins,
        chatName: chatName && chatType === "GROUP" ? chatName : null
    });
    await addChat.save();
    res.status(201).json({ status: "success", data: addChat });
});
module.exports = { getChat, postChat };
