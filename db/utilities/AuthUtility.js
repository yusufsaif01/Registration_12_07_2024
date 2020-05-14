const Promise = require('bluebird');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
var config = require('../../config');
const errors = require('../../errors');
const LoginUtility = require("./LoginUtility");
const ACCOUNT = require("../../constants/AccountStatus")
const RESPONSE_MESSAGE = require("../../constants/ResponseMessage")
const client = Promise.promisifyAll(require("../../redis"))

class AuthUtility {

    constructor() {
        this.loginUtility = new LoginUtility();
    }

    tokenCompare(pass1, pass2) {
        return this.bcryptTokenCompare(pass1, pass2);
    }

    getAuthToken(id, email, member_type) {
        return this.signWithJWT(JSON.stringify({
            id,
            email,
            member_type
        }), config.jwt.jwt_secret, config.jwt.expiry_in);
    }

    randomBytes(len = 20) {
        return crypto.randomBytes(len).toString('hex');
    }

    async bcryptToken(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    async bcryptTokenCompare(pass1, pass2) {
        let isMatched = await bcrypt.compare(pass1, pass2);
        isMatched = (isMatched) ? true : false;
        return Promise.resolve(isMatched);
    }

    signWithJWT(string, secretKey, expiry) {
        return new Promise((resolve, reject) => {
            let data = JSON.parse(string);
            jwt.sign(data, secretKey, { expiresIn: expiry }, (err, token) => {
                if (err) {
                    return reject(err);
                }
                return resolve(token);
            });
        });
    }

    jwtVerification(token, secretKey) {
        return new Promise((resolve, reject) => {
            return jwt.verify(token.split(' ')[1], secretKey, function (err, data) {
                if (err) {
                    console.log(err)
                    return reject(new errors.InvalidToken());
                }

                return resolve(data);
            });
        })
    }

    async getUserFromCacheByKey(key) {
        try {
            let result = await client.getAsync(key);
            result = JSON.parse(result)
            return result;
        }
        catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    }

    async getUserIdFromCacheByKey(key) {
        try {
            let result = await client.getAsync(key);
            return result;
        }
        catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    }

    async getUserByToken(token, isCheckStatus, isCheckForgotPassToken) {
        try {
            token = token.split(' ')[1];
            const user_id = await this.getUserIdFromCacheByKey(token);
            if (!user_id) {
                return Promise.reject(new errors.InvalidToken());
            }
            let user = await this.getUserFromCacheByKey(user_id);
            user.token = token;
            if (user) {
                if (isCheckStatus) {
                    let status = user.status;
                    if (status === ACCOUNT.BLOCKED) {
                        throw new errors.Unauthorized(RESPONSE_MESSAGE.USER_BLOCKED);
                    } else if (status !== ACCOUNT.ACTIVE) {
                        throw new errors.Unauthorized(RESPONSE_MESSAGE.USER_INACTIVE);
                    }
                }

                if (isCheckForgotPassToken) {
                    if (user.forgot_password_token) {
                        const fpt = 'Bearer ' + user.forgot_password_token
                        const fptUser = await this.jwtVerification(fpt, config.jwt.jwt_secret);
                        if (user.user_id !== fptUser.id)
                            throw new errors.Unauthorized(RESPONSE_MESSAGE.USER_AUTHENTICATION_FAILED);
                    } else {
                        throw new errors.LinkExpired(RESPONSE_MESSAGE.LINK_EXPIRED);
                    }
                }
                return user;
            } else {
                throw new errors.Unauthorized();
            }
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    }
}

module.exports = AuthUtility;