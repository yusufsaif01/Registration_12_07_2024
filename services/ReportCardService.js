const ReportCardUtility = require('../db/utilities/ReportCardUtility');
const errors = require("../errors");
const RESPONSE_MESSAGE = require('../constants/ResponseMessage');
const REPORT_CARD_STATUS = require('../constants/ReportCardStatus');
const FOOTPLAYER_STATUS = require('../constants/FootPlayerStatus');
const FootPlayerUtility = require('../db/utilities/FootPlayerUtility');
const ManageReportCardListResponseMapper = require("../dataModels/responseMapper/ManageReportCardListResponseMapper");
const _ = require("lodash");
const moment = require('moment');

class ReportCardService {
    constructor() {
        this.reportCardUtilityInst = new ReportCardUtility();
        this.footPlayerUtilityInst = new FootPlayerUtility();
    }

    /**
     * returns report card list for club/academy
     *
     * @param {*} [requestedData={}]
     * @returns
     * @memberof ReportCardService
     */
    async getManageReportCardList(requestedData = {}) {
        try {
            let searchConditions = this.prepareManageReportCardSearchCondition(requestedData.filters);
            let filterConditions = this.prepareManageReportCardFilterCondition(requestedData.filters);
            let paginationOptions = requestedData.paginationOptions || {};
            let sortOptions = requestedData.sortOptions || {};
            let skipCount = (paginationOptions.page_no - 1) * paginationOptions.limit;
            let options = { limit: paginationOptions.limit, skip: skipCount, sort: {} };
            options.sort[sortOptions.sort_by] = sortOptions.sort_order;

            let data = await this.footPlayerUtilityInst.aggregate([
                { $match: { "sent_by": requestedData.authUser.user_id, status: FOOTPLAYER_STATUS.ADDED, is_deleted: false } },
                { $lookup: { from: "player_details", localField: "send_to.user_id", foreignField: "user_id", as: "player_detail" } },
                { $unwind: { path: "$player_detail" } },
                { $lookup: { from: "report_cards", localField: "player_detail.user_id", foreignField: "send_to", as: "report_card" } },
                {
                    $project: {
                        player_detail: {
                            first_name: 1, last_name: 1, player_type: 1, user_id: 1, avatar_url: 1,
                            report_card: {
                                $filter: {
                                    input: "$report_card", as: "element",
                                    cond: {
                                        $and: [{ $eq: ["$$element.is_deleted", false] },
                                        { $not: { $and: [{ $eq: ["$$element.status", REPORT_CARD_STATUS.DRAFT] }, { $ne: ["$$element.sent_by", requestedData.authUser.user_id] }] } }]
                                    }
                                }
                            },
                        }
                    }
                },
                {
                    $project: {
                        player_detail: {
                            avatar_url: 1, first_name: 1, last_name: 1, player_type: 1, user_id: 1,
                            draft_report_card: {
                                $filter: {
                                    input: "$player_detail.report_card", as: "element",
                                    cond: { $eq: ["$$element.status", REPORT_CARD_STATUS.DRAFT] }
                                }
                            }, report_card: {
                                $filter: {
                                    input: "$player_detail.report_card", as: "element",
                                    cond: { $ne: ["$$element.status", REPORT_CARD_STATUS.DRAFT] }
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        player_detail: {
                            avatar_url: 1, first_name: 1, last_name: 1, player_type: 1, user_id: 1, draft_report_card: 1,
                            report_card: 1, draft_status: { $cond: { if: { $eq: ["$player_detail.draft_report_card", []] }, then: false, else: true } }

                        }
                    }
                },
                {
                    $project: {
                        player_detail: {
                            avatar_url: 1, first_name: 1, last_name: 1, player_type: 1, user_id: 1,
                            draft_report_card: 1, draft_status: 1, report_card: 1, total_report_cards: { $size: "$player_detail.report_card" }
                        }
                    }
                },
                { $unwind: { path: "$player_detail.report_card", preserveNullAndEmptyArrays: true } },
                { $sort: { "player_detail.report_card.published_at": -1 } },
                { $group: { _id: "$player_detail.user_id", player_detail: { $first: "$player_detail" } } },
                {
                    $project: {
                        avatar_url: "$player_detail.avatar_url", first_name: "$player_detail.first_name", last_name: "$player_detail.last_name",
                        name: { $toLower: { $concat: ["$player_detail.first_name", " ", "$player_detail.last_name"] } }, category: "$player_detail.player_type",
                        user_id: "$player_detail.user_id", total_report_cards: "$player_detail.total_report_cards",
                        status: {
                            $cond: {
                                if: { $eq: ["$player_detail.draft_status", true] }, then: REPORT_CARD_STATUS.DRAFT, else: "$player_detail.report_card.status"
                            }
                        }, published_at: "$player_detail.report_card.published_at", draft_report_card: "$player_detail.draft_report_card"
                    }
                },
                { $match: filterConditions }, { $match: searchConditions }, { $sort: options.sort },
                { $facet: { data: [{ $skip: options.skip }, { $limit: options.limit }], total_data: [{ $group: { _id: null, count: { $sum: 1 } } }] } }
            ]);
            let responseData = [], totalRecords = 0;
            if (data && data.length && data[0] && data[0].data) {
                responseData = new ManageReportCardListResponseMapper().map(data[0].data);
                if (data[0].data.length && data[0].total_data && data[0].total_data.length && data[0].total_data[0].count) {
                    totalRecords = data[0].total_data[0].count;
                }
            }
            let response = { total: totalRecords, records: responseData }
            return Promise.resolve(response);
        } catch (e) {
            console.log("Error in getManageReportCardList() of ReportCardService", e);
            return Promise.reject(e);
        }
    }

    /**
     * prepare search conditions for manage report card list
     *
     * @param {*} [filters={}]
     * @returns
     * @memberof ReportCardService
     */
    prepareManageReportCardSearchCondition(filters = {}) {
        let condition = {};
        let filterArr = []
        if (filters.search) {
            filters.search = filters.search.trim()
            filterArr.push({ "name": new RegExp(filters.search, "i") })
            condition = { $or: filterArr };
        }
        return condition;
    }

    /**
     * prepare filter conditions for manage report card list
     *
     * @param {*} [filterConditions={}]
     * @returns
     * @memberof ReportCardService
     */
    prepareManageReportCardFilterCondition(filterConditions = {}) {
        let condition = {};
        let filterArr = []
        if (filterConditions) {
            if (filterConditions.from && filterConditions.to) {
                let published_at = [];
                let fromDate = moment(filterConditions.from).toDate();
                let toDate = moment(filterConditions.to).toDate();
                published_at.push({
                    "published_at": {
                        $gte: fromDate,
                        $lte: toDate
                    }
                });
                filterArr.push({ $or: published_at })
            }
            if (filterConditions.player_category && filterConditions.player_category.length) {
                let player_category = [];
                filterConditions.player_category.forEach(val => {
                    player_category.push({ "category": new RegExp(val, 'i') })
                });
                filterArr.push({ $or: player_category })
            }
            if (filterConditions.status && filterConditions.status.length) {
                let status = [];
                filterConditions.status.forEach(val => {
                    status.push({ "status": new RegExp(val, 'i') })
                });
                filterArr.push({ $or: status })
            }
            condition = {
                $and: filterArr
            }
        }
        return filterArr.length ? condition : {}
    }
}

module.exports = ReportCardService;