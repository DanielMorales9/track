var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var debug = require('debug')('track:model:user');
var bcrypt = require('bcryptjs');

/**
 * User Schema
 */
var UserSchema = new Schema({
    email: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String,
    token: String,
    friends : [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

/**
 * Enables password hashing before saving it
 */
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

/**
 * Schema Plugin to enable authentication
 * @param passw sent password
 * @param cb
 */
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);