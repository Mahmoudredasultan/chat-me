const express = require("express");
const { getAllUsers,postUser,login } =require("../controlers/user.controlers.js")
const upload = require("../utilites/uploadUsersImages.js")
console.log("welcom")
const router = express.Router();

router.route("/").get(getAllUsers).post(upload.single("avatar"),postUser);
router.route("/login/").post(login)
module.exports = router;
