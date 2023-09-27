const ReportCardService = require('../services/ReportCardService');
const responseHandler = require('../ResponseHandler');
const { checkAuthToken, checkRole } = require('../middleware/auth');
const ROLE = require('../constants/Role');
const reportCardValidator = require("../middleware/validators").reportCardValidator;

module.exports = (router) => {

    /**
    * @api {get} /manage/report-card/list report-card listing for club/academy
    * @apiName report card listing
    * @apiGroup Report-card
    * 
    * @apiParam (query) {String} search search will be done on the basis of player name
    * @apiParam (query) {String} page_no page number
    * @apiParam (query) {String} page_size page size
    * @apiParam (query) {String} sort_by sort by field name (name, category, total_report_cards, published_at, status, created_at)
    * @apiParam (query) {String} sort_order (1 for ascending, -1 for descending)
    * @apiParam (query) {String} player_category comma seperated player_category
    * @apiParam (query) {String} from from date (eg. 2020-07-10T00:00:00.000Z)
    * @apiParam (query) {String} to to date (eg. 2020-08-10T00:00:00.000Z)
    * @apiParam (query) {String} status comma seperated status
    * 
    * @apiSuccess {String} status success
    * @apiSuccess {String} message Successfully done
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *          "status": "success",
    *          "message": "Successfully done",
    *          "data": {
    *              "total": 1,
    *              "records": [
    *                  {
    *                      "user_id": "9e770dd5-629d-4d73-9e53-ad4b798a201e",
    *                      "avatar": "/uploads/avatar/user-avatar.png",
    *                      "name": "Rajesh Kumar",
    *                      "category": "grassroot",
    *                      "total_report_cards": 1,
    *                      "published_at": "2020-08-10T00:00:00.000Z",
    *                      "status": "published/draft"
    *                  },
    *              ]
    *          }
    *      }
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

    router.get("/manage/report-card/list", checkAuthToken, checkRole([ROLE.CLUB, ROLE.ACADEMY]), reportCardValidator.manageReportCardListValidation, function (req, res) {
        console.log("report card list ")
        let paginationOptions = {
            page_no: (req.query && req.query.page_no) ? req.query.page_no : 1,
            limit: (req.query && req.query.page_size) ? Number(req.query.page_size) : 10
        },
            sortOptions = {
                sort_by: (req.query && req.query.sort_by) ? req.query.sort_by : "name",
                sort_order: (req.query && req.query.sort_order) ? Number(req.query.sort_order) : 1
            },
            filters = {
                search: (req.query && req.query.search) ? req.query.search : null,
                from: (req.query && req.query.from) ? req.query.from : null,
                to: (req.query && req.query.to) ? req.query.to : null,
                status: (req.query && req.query.status) ? req.query.status.split(",") : null,
                player_category: (req.query && req.query.player_category) ? req.query.player_category.split(",") : null,
            };

        let serviceInst = new ReportCardService();
        return responseHandler(req, res, serviceInst.getManageReportCardList({ authUser: req.authUser, paginationOptions, sortOptions, filters }));
    });

    /**
     * @api {post} /report-card create report-card
     * @apiName create report card
     * @apiGroup Report-card
     * 
     * @apiParam (body) {String} send_to user_id of player for whom report card is being created
     * @apiParam (body) {String} [remarks] remarks
     * @apiParam (body) {String} status report card status (published/draft)
     * @apiParam (body) {String} abilities array of object with fields (ability_id, attributes (array of object with fields (attribute_id, attribute_score)))
     * 
     * @apiSuccess {String} status success
     * @apiSuccess {String} message Successfully done
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Successfully done"
     *     }
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
    router.post('/report-card', checkAuthToken, checkRole([ROLE.CLUB, ROLE.ACADEMY]), function (req, res) {
        let serviceInst = new ReportCardService();
        return responseHandler(req, res, serviceInst.createReportCard({ reqObj: req.body, authUser: req.authUser }));
    });

    /**
     * @api {put} /report-card/:report_card_id edit draft report-card
     * @apiName edit draft report card
     * @apiGroup Report-card
     * 
     * @apiParam (body) {String} [remarks] remarks
     * @apiParam (body) {String} status report card status (published/draft)
     * @apiParam (body) {String} abilities array of object with fields (ability_id, attributes (array of object with fields (attribute_id, attribute_score)))
     * 
     * @apiSuccess {String} status success
     * @apiSuccess {String} message Successfully done
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Successfully done"
     *     }
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
    router.put('/report-card/:report_card_id', checkAuthToken, checkRole([ROLE.CLUB, ROLE.ACADEMY]), function (req, res) {
        let serviceInst = new ReportCardService();
        return responseHandler(req, res, serviceInst.editReportCard({
            reqObj: req.body,
            authUser: req.authUser, report_card_id: req.params.report_card_id
        }));
    });

    /**
     * @api {get} /manage/report-card/list/:player_id player report-card listing for club/academy
     * @apiName player report card listing for club/academy
     * @apiGroup Report-card
     * 
     * @apiParam (param) {String} player_id user_id of player
     * @apiParam (query) {String} page_no page number
     * @apiParam (query) {String} page_size page size
     * 
     * @apiSuccess {String} status success
     * @apiSuccess {String} message Successfully done
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "status": "success",
     *          "message": "Successfully done",
     *          "data": {
     *              "total": 1,
     *              "draft_id": "9e770dd5-629d-4d73-9e53-ad4b798a201e",
     *              "player_name": "test",
     *              "records": [
     *                  {
     *                      "id": "9e770dd5-629d-4d73-9e53-ad4b798a201e",
     *                      "sent_by": "7b2aae40-b92d-41c9-a1b5-84c0b20d9996",
     *                      "published_at": "2020-08-10T00:00:00.000Z",
     *                      "created_by": "xyz club",
     *                      "status": "published/draft"
     *                  },
     *              ]
     *          }
     *      }
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
    router.get("/manage/report-card/list/:player_id", checkAuthToken, checkRole([ROLE.CLUB, ROLE.ACADEMY]),
    reportCardValidator.managePlayerReportCardListValidation, function (req, res) {
            console.log("report card list ")
            let paginationOptions = {
                page_no: (req.query && req.query.page_no) ? req.query.page_no : 1,
                limit: (req.query && req.query.page_size) ? Number(req.query.page_size) : 10
            };
            let serviceInst = new ReportCardService();
            return responseHandler(req, res, serviceInst.getManagePlayerReportCardList({ authUser: req.authUser, player_id: req.params.player_id, paginationOptions }));
        });

    /**
     * @api {get} /report-card/view/:report_card_id view report card
     * @apiName view report card
     * @apiGroup Report-card
     * 
     * @apiParam (param) {String} report_card_id report card id
     * 
     * @apiSuccess {String} status success
     * @apiSuccess {String} message Successfully done
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *         "status": "success",
     *         "message": "Successfully done",
     *         "data": {
     *             "send_to": "28c9b093-a7b6-4734-89a1-dc2e964754a5",
     *             "abilities": [
     *                 {
     *                     "_id": "5f33f45e99f991234462f50a",
     *                     "ability_id": "bf81cb90-9bd5-4026-af53-a09ef28beaca",
     *                     "ability_name": "Physical",
     *                     "attributes": [
     *                         {
     *                             "_id": "5f33f45e99f991234462f50b",
     *                             "attribute_id": "9a1a7067-78e1-45ed-8125-70f0223e11f1",
     *                             "attribute_name": "Speed",
     *                             "attribute_score": 10
     *                         },
     *                         {
     *                             "_id": "5f33f45e99f991234462f50c",
     *                             "attribute_id": "ea0f55c2-9002-4d1c-b3f1-15492ce8f42f",
     *                             "attribute_name": "Strength",
     *                             "attribute_score": 10
     *                         },
     *                         {
     *                             "_id": "5f33f45e99f991234462f50d",
     *                             "attribute_id": "4c112c16-9f74-48d4-a2a4-21af94413217",
     *                             "attribute_name": "Agile",
     *                             "attribute_score": 10
     *                         }
     *                     ]
     *                 }
     *             ],
     *             "remarks": "xyz",
     *             "status": "published",
     *             "published_at": "2020-08-12T00:00:00.000Z",
     *             "sent_by": "3271a11e-2a4a-45ec-bc83-ffbfcb4b0c5b",
     *             "id": "43950653-b597-4805-b7fc-a483c7629ecd"
     *         }
     *     }
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
    router.get("/report-card/view/:report_card_id", checkAuthToken, function (req, res) {
        let serviceInst = new ReportCardService();
        return responseHandler(req, res, serviceInst.viewReportCard({ authUser: req.authUser, report_card_id: req.params.report_card_id }));
    });

    /**
     * @api {get} /player/report-card/list report-card listing for player
     * @apiName player report card listing
     * @apiGroup Report-card
     * 
     * @apiParam (query) {String} search search will be done on the basis of club/academy name
     * @apiParam (query) {String} page_no page number
     * @apiParam (query) {String} page_size page size
     * @apiParam (query) {String} sort_by sort by field name (name, created_by, published_at, created_at)
     * @apiParam (query) {String} sort_order (1 for ascending, -1 for descending)
     * @apiParam (query) {String} created_by comma seperated created_by
     * @apiParam (query) {String} from from date (eg. 2020-07-10T00:00:00.000Z)
     * @apiParam (query) {String} to to date (eg. 2020-08-10T00:00:00.000Z)
     * @apiParam (query) {String} name club/academy name
     * 
     * @apiSuccess {String} status success
     * @apiSuccess {String} message Successfully done
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "status": "success",
     *          "message": "Successfully done",
     *          "data": {
     *              "total": 1,
     *              "records": [
     *                  {
     *                      "id": "06fd3ebf-b78c-477c-a549-5c07c684753f",
     *                      "sent_by": "9e770dd5-629d-4d73-9e53-ad4b798a201e",
     *                      "name": "xyz club",
     *                      "created_by": "club",
     *                      "published_at": "2020-08-10T00:00:00.000Z"
     *                  },
     *              ]
     *          }
     *      }
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
    router.get("/player/report-card/list", checkAuthToken, reportCardValidator.playerReportCardListValidation, function (req, res) {
        let paginationOptions = {
            page_no: (req.query && req.query.page_no) ? req.query.page_no : 1,
            limit: (req.query && req.query.page_size) ? Number(req.query.page_size) : 10
        },
            sortOptions = {
                sort_by: (req.query && req.query.sort_by) ? req.query.sort_by : "created_at",
                sort_order: (req.query && req.query.sort_order) ? Number(req.query.sort_order) : -1
            },
            filters = {
                search: (req.query && req.query.search) ? req.query.search : null,
                from: (req.query && req.query.from) ? req.query.from : null,
                to: (req.query && req.query.to) ? req.query.to : null,
                created_by: (req.query && req.query.created_by) ? req.query.created_by.split(",") : null,
                name: (req.query && req.query.name) ? req.query.name : null,
            };

        let serviceInst = new ReportCardService();
        return responseHandler(req, res, serviceInst.getPlayerReportCardList({ authUser: req.authUser, paginationOptions, sortOptions, filters }));
    });
};
