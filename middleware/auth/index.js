const errors = require('../../errors');
const AuthUtility = require('../../db/utilities/AuthUtility');

var _checkRole = (req, roles) => {
    if (!req.authUser || !req.authUser.role) {
        return false;
    }
    return roles.includes(req.authUser.role);
};

const _checkToken = async (req, isCheckStatus) => {
    try {
        const token = req.headers.authorization || req.body.token;
        if (token) {
            const authUtilityInst = new AuthUtility();
            const user = await authUtilityInst.getUserByToken(token, isCheckStatus);
            return user;
        } 
        throw new errors.Unauthorized();

    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
};

module.exports = {
    checkRole(roles) {
        roles = Array.isArray(roles) ? roles : [roles];
        return (req, res, next) => {
            if (!_checkRole(req, roles)) {
                return next(new errors.Unauthorized());
            }
            return next();
        }
    },

    async checkAuthToken(req, res, next) {
        try {
            const user = await _checkToken(req, true);
            req.authUser = user;
            return next();
        } catch (err) {
            console.log(err);
            return next(err);
        }

    },

    async checkTokenForAccountActivation(req, res, next) {
        try {
            const user = await _checkToken(req, false);
            req.authUser = user;
            return next();
        } catch (err) {
            console.log(err);
            return next(err);
        }
    }
};
