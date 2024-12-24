const messageModle = require("../mongooseModels/message.modle.js");
const {
    getAllmessages,
    sendMessage,
    deletedmessage,
    updateMessageReaded,
    updateMessageReceives
} = require("../controlers/message.controler.js");
const verifyToken = require("../middel-weres/verifyToken.js");
const express = require("express");
const upload = require("../utilites/uploadMessage.js");
const router = express.Router();
router.route("/").post(verifyToken, upload.single("link"), sendMessage);
router.route("/:chatId").get(getAllmessages);
router.route("/:id").delete(verifyToken, deletedmessage);
router.route("/Readed/:id").patch(verifyToken, updateMessageReaded);
router.route("/Receives/:id").patch(verifyToken, updateMessageReceives);
module.exports = router;
