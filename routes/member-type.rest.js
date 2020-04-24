const MemberTypeService = require('../services/MemberTypeService');
const responseHandler = require('../ResponseHandler');

module.exports = (router) => {

    /**
     * @api {get} /member-type/list member type listing
     * @apiName member type listing
     * @apiGroup Member type
     * 
     * @apiSuccess {String} status success
     * @apiSuccess {String} message Successfully done
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Successfully done",
     *       "data": [{ 
     *                  "id":"eb9bff0d-7fad-4845-b3ad-138ff751eaba",
     *                  "category":"Player",
     *                  "sub_category":"Grassroot"
     *               }]
     *
     *
     * @apiErrorExample {json} INTERNAL_SERVER_ERROR:
     *     HTTP/1.1 500 Internal server error
     *     {
     *       "message": "Internal Server Error",
     *       "code": "INTERNAL_SERVER_ERROR",
     *       "httpCode": 500
     *     }
     * 
     */

    router.get("/member-type/list", function (req, res) {
        let serviceInst = new MemberTypeService();
        return responseHandler(req, res, serviceInst.getMemberTypeList());
    });
};