// const errors = require('../../errors');
const AuthUtility = require('../../db/utilities/AuthUtility');

var _checkRole = (req, roles) => {
    if (!req.authUser || !req.authUser.role) {
        return false;
    }
    return roles.includes(req.authUser.role);
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

    checkAuthToken(req, res, next) {
        
        const token = req.headers.authorization || req.body.token;
        const authUtilityInst = new AuthUtility();
        return authUtilityInst.getUserByToken(token)
        .then((user) => {
            req.authUser = user;
            return next();
        })
        .catch((err) => {
            console.log(err);
            return next(err);
        });
    }

  
};
