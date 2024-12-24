const AppError = require("../utilites/AppError.js");
const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    const authHeader =
        req.headers["Authorization"] || req.headers["authorization"];
    if (!authHeader) {
        const error = AppError.create(
            "you must have atoken in header",
            401,
            "fail"
        );
        return next(error);
    }
    const token = authHeader.split(" ")[1];
    const tokenCheck = jwt.verify(token, process.env.secrit_key);
    
    if (!tokenCheck) {
        const er = AppError.create("this toke not avilabel", 404, "error");
        return next(er);
    }
    req.data = tokenCheck
    next()
};
