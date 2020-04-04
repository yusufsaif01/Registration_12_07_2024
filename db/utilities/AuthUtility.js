const Promise = require('bluebird');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
var config = require('../../config');
const errors = require('../../errors');
const PlayerUtility = require('../utilities/PlayerUtility');
const ClubAcademyUtility = require('../utilities/ClubAcademyUtiltiy');

class AuthUtility {

    constructor() {
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

    bcryptToken(password) {
        return bcrypt.hash(password, 10).then((hash) => {
            return hash;
        })
    }

    bcryptTokenCompare(pass1, pass2) {
        return bcrypt.compare(pass1, pass2).then(res => {
            if (!res) {
                return Promise.resolve(false);

            }

            return Promise.resolve(true);
        })
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
                    return reject(err);
                }
                console.log('jwt', data)
                return resolve(data);
            });
        })
    }

    getUserByToken(token) {
        console.log('token', token)
        return this.jwtVerification(token, config.jwt.jwt_secret)
            .catch(() => {
                return Promise.reject(new errors.Unauthorized());
            })
            .then(async ({ id, email, member_type }) => {

                const _playerUtilityInst = new PlayerUtility();
                const _clubAcademyUtilityInst = new ClubAcademyUtility();
                console.log(id, email, member_type);
                let obj = {}
                if (member_type == 'player') {
                    obj = await _playerUtilityInst.findOne({ id: id });
                    obj.member_type = member_type;
                    return obj;
                }
                else {
                    obj = await _clubAcademyUtilityInst.findOne({ id: id });
                    obj.member_type = member_type;
                    return obj;
                }
            })
            .then((user) => {
                if (!user) {
                    return Promise.reject(new errors.Unauthorized());
                }
                return user;
            });
    }

}

module.exports = AuthUtility;