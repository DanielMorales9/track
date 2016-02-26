/**
 * Error thrown when Not Found 404 is detected
 * @param code HTTP Status Code
 * @param error Error Message
 * @constructor
 */
function UnauthorizedError(code, error) {
    Error.call(this, typeof error === "undefined" ? undefined : error.message);
    Error.captureStackTrace(this, this.constructor);
    this.name = "UnauthorizedError";
    this.message = typeof error === "undefined" ? undefined : error.message;
    this.code = typeof code === "undefined" ? "404" : code;
    this.status = 401;
    this.inner = error;
}

UnauthorizedError.prototype = Object.create(Error.prototype);
UnauthorizedError.prototype.constructor = UnauthorizedError;

module.exports = UnauthorizedError;
