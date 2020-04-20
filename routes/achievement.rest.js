const AchievementService = require('../services/AchievementService');
const responseHandler = require('../ResponseHandler');
const { checkAuthToken } = require('../middleware/auth');

module.exports = (router) => {
    router.get('/achievement/count', checkAuthToken, function (req, res) {
        let serviceInst = new AchievementService();
        responseHandler(req, res, serviceInst.count(req.authUser.user_id));
    });
}