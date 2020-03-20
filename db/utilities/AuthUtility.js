const Promise = require('bluebird');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
var config       = require('../../config');
const errors = require('../../errors');
const UserUtility = require('../utilities/UserUtility');

class AuthUtility {

	constructor() {
    }	

    tokenCompare(pass1, pass2){
        return this.bcryptTokenCompare(pass1, pass2);
    }

    getAuthToken(id, emp_id , email, username) {
        
        return this.signWithJWT(JSON.stringify({            
            id,
            emp_id ,
            email,
            username
        }), config.jwt.jwt_secret , config.jwt.expiry_in);
    }

    randomBytes(len=20) {
        return crypto.randomBytes(len).toString('hex');
    }

    bcryptToken(password) {
        return bcrypt.hash(password, 10).then((hash)=>{
            return hash;
        })
    }

    bcryptTokenCompare(pass1, pass2) {
        return bcrypt.compare(pass1, pass2).then(res => {
            if (!res) {
                return Promise.reject(false);
            }
            return Promise.resolve(true);
        })
    }

    signWithJWT(string, secretKey, expiry) {
        return new Promise((resolve, reject) => {
            let data = JSON.parse(string);
            jwt.sign(data, secretKey, { expiresIn: expiry}, (err, token) => {
                if (err) {
                    return reject(err);
                }
                return resolve(token);
            });
        });
    }

    jwtVerification(token, secretKey) {
        return new Promise((resolve, reject) => {
            return jwt.verify(token.split(' ')[1], secretKey, function(err, data) {        
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        })
    }

    getUserByToken(token) {

        return this.jwtVerification(token, config.jwt.jwt_secret)
        .catch(() => {
            return Promise.reject(new errors.Unauthorized());
        })
        .then(({ id, email, emp_id }) => {

             const _userUtilityInst = new UserUtility();
            console.log(id,email,emp_id);

            return _userUtilityInst.findOne({ emp_id : emp_id});
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