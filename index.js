const express = require("express");
const users = require("./mongooseModels/mongoose.models.js");
const compression = require("compression")
const cors = require("cors")
const path = require("node:path");
const userRouter = require("./routers/user.route.js");
const chatRouter = require("./routers/chat.route.js");
const messageRouter = require("./routers/message.route.js");
const app = express();
app.use(compression())
app.use(cors());
app.use(express.json());
app.use(
    "/upload",
    express.static(path.join(__dirname, "upload"))
);
app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        status: error.errorName || "erorr",
        message: error.message,
        data: null
    });
});
app.listen(process.env.PORT || "4000", () => {
    console.log("http://localhost:4000");
});
