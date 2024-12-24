const asyncWraper = require("../middel-weres/asyncWraper.js");
const messageModel = require("../mongooseModels/message.modle.js");
const chatModle = require("../mongooseModels/chat.model.js");
const AppError = require("../utilites/AppError.js");
const newDate = require("../utilites/current.Date.js");
const getAllmessages = asyncWraper(async (req, res, next) => {
    const chatId = req.params.chatId;
    const messages = await messageModel.find({ chatId });
    res.json({ status: "success", data: messages });
});

const sendMessage = asyncWraper(async (req, res, next) => {
    const { content, chatId } = req.body;
    const chat = await chatModle.findOne({ _id: chatId });
    const participants = chat.participants;
    let link = null;
    let messageType = [];
    if (req.file) {
        link = req.file.path;
        messageType.push(req.fileType);
    }
    if (content) {
        messageType.push("TEXT");
    }
    const sender = req.data.name;
    if (!content || !sender || !chatId) {
        const error = AppError.create(
            "you must inter the <<content>> && <<senderId>> && <<chatId>>",
            404,
            "fail"
        );
        return next(error);
    }
    const messageStatus = {};
    participants.forEach(el => {
        if (el !== sender) {
            messageStatus[`${el}`] = {
                sendIn: newDate(true),
                readIn: null,
                receivesIn: null
            };
        }
    });
    const addMessage = new messageModel({
        chatId,
        sender,
        content,
        messageType: messageType,
        link: link,
        messageStatus
    });
    await addMessage.save();
    const upd = await chatModle.updateOne(
        { _id: chatId },
        { $set: { lastMessage: content, updatedAt: newDate(true) } }
    );
    res.json({ stetus: "success", data: addMessage });
});

const deletedmessage = asyncWraper(async (req, res, next) => {
    const deleter = req.data.name;
    const _id = req.params.id;
    const message = await messageModel.findOne({ _id });
    const chat = await chatModle.findOne({ _id: message.chatId });

    if (chat.chatType === "SINGLE") {
        if (deleter !== message.sender) {
            const error = AppError.create(
                "you cant delet this message",
                401,
                "fail"
            );
            return next(error);
        }
    }
    if (chat.chatType === "GROUP") {
        if (deleter !== message.sender) {
            const checkAdmin = chat.admins.find(el => el === deleter);
            if (!checkAdmin) {
                const error4 = AppError.create(
                    "you not admin you cant delet this message",
                    401,
                    "fail"
                );
                return next(error4);
            }
        }
    }
    const deletedRealmessage = await messageModel.updateOne(
        { _id },
        { $set: { deleted: true } }
    );
    res.json({ status: "success", data: deletedRealmessage });
});

const updateMessageReaded = asyncWraper(async (req, res, next) => {
    const _id = req.params.id;
    const reader = req.data.name;
    const currMessage = await messageModel.findOne({ _id });
    const nowChat = await chatModle.findOne({ _id: currMessage.chatId });
    const { participants } = nowChat;
    const check = participants.find(el => el === reader);
    if (!check) {
        const er1 = AppError.create(
            `you are ${reader} not department in this chat`,
            401,
            "fail"
        );
        return next(er1);
    }
    if (currMessage.sender === reader) {
        const error = AppError.create(
            "you are the sender you oridy read it ",
            401,
            "fail"
        );
        return next(error);
    }
    let { messageStatus } = currMessage;
    if (messageStatus[`${reader}`].readIn !== null) {
        const er0 = AppError.create("you oridy read this message", 404, "fail");
        return next(er0);
    }
    messageStatus[`${reader}`].readIn = newDate(true);
    const readMessage = await messageModel.updateOne(
        { _id },
        { $set: { messageStatus: messageStatus } }
    );
    res.json({ stetus: "success", data: null });
});

const updateMessageReceives = asyncWraper(async (req, res, next) => {
    const _id = req.params.id;
    const recevier = req.data.name;
    const currMessage = await messageModel.findOne({ _id });
    const nowChat = await chatModle.findOne({ _id: currMessage.chatId });
    const { participants } = nowChat;
    const check = participants.find(el => el === recevier);
    if (!check) {
        const er1 = AppError.create(
            `you are ${recevier} not department in this chat`,
            401,
            "fail"
        );
        return next(er1);
    }
    if (currMessage.sender === recevier) {
        const error = AppError.create(
            "you are the sender you oridy read it ",
            401,
            "fail"
        );
        return next(error);
    }
    let { messageStatus } = currMessage;
    if (messageStatus[`${recevier}`].receivesIn !== null) {
        const er0 = AppError.create(
            "you oridy receives this message",
            404,
            "fail"
        );
        return next(er0);
    }
    messageStatus[`${recevier}`].receivesIn = newDate(true);
    const readMessage = await messageModel.updateOne(
        { _id },
        { $set: { messageStatus: messageStatus } }
    );
    res.json({ stetus: "success", data: null });
});
module.exports = {
    getAllmessages,
    sendMessage,
    deletedmessage,
    updateMessageReaded,
    updateMessageReceives
};
