const multer = require("multer");
const AppError = require("./AppError.js");
const { images } = require("./filesType.js");
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "upload/images");
    },
    filename: function (req, file, cb) {
        const fileName = `user-${Date.now()}.${
            file.originalname.split(".")[1]
        }`;
        console.log(fileName);
        cb(null, fileName);
    }
});
const fileFilter = function (req, file, cb) {
    const fileExtention = file.originalname.split(".")[1];
    const check = images.find(el => el === fileExtention);
    if (check) {
        cb(null, true);
    } else {
        const error = AppError.create(
            "please check this file : this file is not image"
        );
        cb(error, false);
    }
};
module.exports = multer({ storage: diskStorage, fileFilter });
