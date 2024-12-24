class AppError extends Error {
    constructor() {
        super();
    }
    create = (message, status, errorName) => {
        this.message = message;
        this.status = status;
        this.errorName = errorName;
        return this;
    };
}
module.exports = new AppError()