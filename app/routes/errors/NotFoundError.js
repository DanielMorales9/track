/**
 * Error thrown when unauthorized is found
 * @param code HTTP Status Code
 * @param error Error Message
 * @constructor
 */
function Unauthorized(code, error) {
    Error.call(this, typeof error === "undefined" ? undefined : error.message);
    Error.captureStackTrace(this, this.constructor);
    this.name = "NotFoundError";
    this.message = typeof error === "undefined" ? undefined : error.message;
    this.code = typeof code === "undefined" ? "401" : code;
    this.status = 401;
    this.inner = error;
}

Unauthorized.prototype = Object.create(Error.prototype);
Unauthorized.prototype.constructor = Unauthorized;

module.exports = NotFoundError;
