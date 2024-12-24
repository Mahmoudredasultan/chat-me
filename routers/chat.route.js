const express = require("express");
const verifyToken = require("../middel-weres/verifyToken.js");
const { getChat, postChat } = require("../controlers/chat.controler.js");
const router = express.Router();
router.route("/:name").get(verifyToken, getChat);
router.route("/").post(postChat);
module.exports = router;
