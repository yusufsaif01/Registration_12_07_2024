const Promise = require("bluebird");
const errors = require("../errors");
const PlayerUtility = require('../db/utilities/PlayerUtility');
const ClubAcademyUtility = require('../db/utilities/ClubAcademyUtility');
const AuthUtility = require('../db/utilities/AuthUtility');
const LoginUtility = require('../db/utilities/LoginUtility');
const BaseService = require("./BaseService");
const _ = require("lodash");
const UserListResponseMapper = require("../dataModels/responseMapper/UserListResponseMapper");

class UserService extends BaseService {

    constructor() {
        super();
        this.playerUtilityInst = new PlayerUtility();
        this.clubAcademyUtilityInst = new ClubAcademyUtility();
        this.authUtilityInst = new AuthUtility();
        this.loginUtilityInst = new LoginUtility();
    }

    async getList(requestedData = {}) {
        try {
            let conditions = this._prepareCondition(requestedData.filter);

            let paginationOptions = requestedData.paginationOptions || {};
            let sortOptions = requestedData.sortOptions || {};

            let skipCount = (paginationOptions.page_no - 1) * paginationOptions.limit;
            let options = { limit: paginationOptions.limit, skip: skipCount, sort: {} };

            if (!_.isEmpty(sortOptions.sort_by) && !_.isEmpty(sortOptions.sort_order))
                options.sort[sortOptions.sort_by] = sortOptions.sort_order;
            let totalRecords = 0, amateur_count = 0, professional_count = 0, grassroot_count = 0;
            let member_type = requestedData.member_type, response = {}, data;
            if (member_type === 'player') {
                totalRecords = await this.playerUtilityInst.countList(conditions);
                amateur_count = await this.playerUtilityInst.countList({ player_type: 'amateur' })
                professional_count = await this.playerUtilityInst.countList({ player_type: 'professional' })
                grassroot_count = await this.playerUtilityInst.countList({ player_type: 'grassroot' })
                data = await this._search(conditions, null, options, member_type);
                data = new UserListResponseMapper().map(data, member_type);
                response = {
                    total: totalRecords,
                    records: data,
                    players_count: {
                        grassroot: grassroot_count,
                        professional: professional_count,
                        amateur: amateur_count
                    }
                }
            }
            else {
                conditions.member_type = member_type
                totalRecords = await this.clubAcademyUtilityInst.countList(conditions);
                data = await this._search(conditions, null, options, member_type);
                data = new UserListResponseMapper().map(data, member_type);
                response = {
                    total: totalRecords,
                    records: data
                }
            }
            return response
        } catch (e) {
            console.log("Error in getList() of UserUtility", e);
            return Promise.reject(e);
        }
    }
    async getStatusByUserId(users) {
        let statusArray = [];
        for (const user of users) {
            let { status } = await this.loginUtilityInst.findOne({ user_id: user.user_id });
            statusArray.push(status);
        }
        return statusArray;
    }
    async _search(filter, fields, options, member_type = {}) {
        if (member_type === 'player') {
            let data = {};
            let player = await this.playerUtilityInst.find(filter, fields, options);
            data.player = player

            let loginDetails = await this.getStatusByUserId(player);
            data.loginDetails = loginDetails
            return data;
        }
        else {
            let data = {};
            let clubAcademy = await this.clubAcademyUtilityInst.find(filter, fields, options);
            data.clubAcademy = clubAcademy
            let loginDetails = await this.getStatusByUserId(clubAcademy);
            data.loginDetails = loginDetails
            return data;
        }
    }

    async getDetails(user = {}) {
        try {
            let loginDetails = await this.loginUtilityInst.findOne({ user_id: user.user_id });
            if (loginDetails) {
                if (!loginDetails.is_email_verified) {
                    return responseHandler(req, res, Promise.reject(new errors.Unauthorized("email is not verified")));
                }

                let data = {};
                if (loginDetails.member_type == 'player') {
                    data = await this.playerUtilityInst.findOne({ "user_id": user.user_id });
                } else {
                    data = await this.clubAcademyUtilityInst.findOne({ "user_id": user.user_id });
                }
                if (!_.isEmpty(data)) {
                    data.member_type = loginDetails.member_type;
                    return data;
                } else {
                    return Promise.reject(new errors.NotFound("User not found"));
                }
            }
            throw new errors.NotFound("User not found");

        } catch (e) {
            console.log("Error in getDetails() of UserUtility", e);
            return Promise.reject(e);
        }
    }

    async update(requestedData = {}) {
        try {
            return this.playerUtilityInst.findOneAndUpdate({ "id": requestedData.id }, requestedData.updateValues);
        } catch (e) {
            console.log("Error in update() of UserUtility", e);
            return Promise.reject(e);
        }
    }

    /**
     *
     *
     * @param {*} { name,first_name,last_name,member_type,role,email,state,country,phone}
     * @returns
     * @memberof UserRegistrationService
     */
    async create({
        name,
        first_name,
        last_name,
        member_type,
        role,
        email,
        state,
        country,
        phone
    }) {
        email = email.toLowerCase();
        let member = {};
        member.member_type = member_type;
        member.role = role;
        member.email = email;
        member.phone = phone;
        member.state = state;
        let user = [];
        user.push({ 'email': email });
        if (member_type == 'player') {
            member.first_name = first_name;
            member.last_name = last_name;
            member.country = country;
        }
        else {
            member.name = name;
            member.type = member_type;
            let address = {};
            address.country = country;
            member.address = address;
        }
        let foundPlayer = await this.playerUtilityInst.findOne({ $or: user })
        let foundClub = await this.clubAcademyUtilityInst.findOne({ $or: user })
        if (foundPlayer || foundClub) {
            return Promise.reject(new errors.Conflict("User already exist."));
        }

        return this._create(member)
    }

    /**
     *
     *
     * @param {*} member
     * @returns
     * @memberof UserRegistrationService
     */
    _create(member) {
        if (member.member_type == 'player') {
            return this.playerUtilityInst.insert(member)
                .catch((err) => {
                    console.log(err)
                    if (err.constructor.name === 'Conflict') {
                        err.message = 'User already exist.';
                    }

                    return Promise.reject(err);
                });
        }
        else {
            return this.clubAcademyUtilityInst.insert(member)
                .catch((err) => {
                    console.log(err)
                    if (err.constructor.name === 'Conflict') {
                        err.message = 'User already exist.';
                    }

                    return Promise.reject(err);
                });
        }


    }



    _prepareCondition(filters = {}) {
        let condition = {};
        if (filters.search) {
            condition = {
                $or: [
                    {
                        email: new RegExp(filters.search, "i")
                    },
                    {
                        first_name: new RegExp(filters.search, "i")
                    },
                    {
                        last_name: new RegExp(filters.search, "i")
                    },
                    {
                        player_type: new RegExp(filters.search, "i")
                    }
                    ,
                    {
                        position: {
                            $elemMatch: {
                                name: new RegExp(filters.search, "i"),
                                priority: 1
                            }
                        }
                    }
                ]
            };
        }

        return condition;
    }

}

module.exports = UserService;