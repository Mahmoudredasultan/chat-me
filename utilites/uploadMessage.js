const multer = require("multer");
const AppError = require("./AppError.js");
const { images, vedios } = require("./filesType.js");
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file);
        const fileType = file.originalname.split(".")[1];
        const imagecheck = images.find(el => el === fileType);
        const vedioChich = vedios.find(el => el === fileType);
        if (imagecheck) {
            req.fileType="IMAGE"
            cb(null, "upload/images");
        } else if (vedioChich) {
            req.fileType="VIDEO"
            cb(null, "upload/videos");
        }
    },
    filename: function (req, file, cb) {
        const fileName = `user-${Date.now()}.${
            file.originalname.split(".")[1]
        }`;
        cb(null, fileName);
    }
});
const fileFilter = function (req, file, cb) {
    const filesTypes = [...images, ...vedios];
    const filextention = file.originalname.split(".")[1];
    console.log(filextention, filesTypes);
    const checkFile = filesTypes.find(el => el === filextention);
    console.log(checkFile);
    if (!checkFile) {
        const error = AppError.create(
            "this file is not allowed her please inter image or video",
            500,
            "error"
        );
        cb(error, false);
    } else {
        cb(null, true);
    }
};
module.exports = multer({ storage: diskStorage, fileFilter });
