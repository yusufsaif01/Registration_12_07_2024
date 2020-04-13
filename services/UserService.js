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

            let member_type = requestedData.member_type, response = {}, data;

            let conditions = this._prepareSearchCondition(requestedData.filter, member_type);

            let paginationOptions = requestedData.paginationOptions || {};
            let sortOptions = requestedData.sortOptions || {};

            let skipCount = (paginationOptions.page_no - 1) * paginationOptions.limit;
            let options = { limit: paginationOptions.limit, skip: skipCount, sort: {} };

            if (!_.isEmpty(sortOptions.sort_by) && !_.isEmpty(sortOptions.sort_order))
                options.sort[sortOptions.sort_by] = sortOptions.sort_order;

            if (requestedData.filterConditions && (requestedData.filterConditions.email_verified || requestedData.filterConditions.profile_status)) {
                let _condition = {}
                if (requestedData.filterConditions.email_verified)
                    _condition.is_email_verified = (String(requestedData.filterConditions.email_verified).toLowerCase() === "true");
                if (requestedData.filterConditions.profile_status)
                    _condition.profile_status = requestedData.filterConditions.profile_status;

                let users = await this.loginUtilityInst.find(_condition, { user_id: 1 });
                users = _.map(users, "user_id");
                conditions.user_id = { $in: users };
            }

            if (requestedData.filter && requestedData.filter.search) {
                let _condition = {}
                _condition.status = new RegExp(requestedData.filter.search, 'i');

                let users = await this.loginUtilityInst.find(_condition, { user_id: 1 });
                users = _.map(users, "user_id");
                if (conditions.$or)
                    conditions.$or.push({ user_id: { $in: users } });

            }

            filterConditions = this._prepareFilterCondition(requestedData.filterConditions, member_type)
            if (filterConditions) {
                conditions.$and = filterConditions.$and
            }

            if (member_type === 'player') {
                response = await this.getPlayerList(conditions, options, member_type);
            } else {
                response = await this.getClubAcademyList(conditions, options, member_type);
            }
            return response
        } catch (e) {
            console.log("Error in getList() of UserUtility", e);
            return Promise.reject(e);
        }
    }

    async getPlayerList(conditions, options, member_type) {
        try {
            let totalRecords = 0, amateur_count = 0, professional_count = 0, grassroot_count = 0;

            totalRecords = await this.playerUtilityInst.countList(conditions);
            amateur_count = await this.playerUtilityInst.countList({ ...conditions, player_type: 'amateur' })
            professional_count = await this.playerUtilityInst.countList({ ...conditions, player_type: 'professional' })
            grassroot_count = await this.playerUtilityInst.countList({ ...conditions, player_type: 'grassroot' })

            let baseOptions = {
                conditions: conditions,
                options: options,
                projection: { first_name: 1, last_name: 1, player_type: 1, email: 1, position: 1 , user_id: 1}
            };

            let toBePopulatedOptions = {
                path: "login_details",
                projection: { status: 1, is_email_verified: 1, profile_status: 1 }
            };

            let data = await this.playerUtilityInst.populate(baseOptions, toBePopulatedOptions);

            data = new UserListResponseMapper().map(data, member_type);
            let response = {
                total: totalRecords,
                records: data,
                players_count: {
                    grassroot: grassroot_count,
                    professional: professional_count,
                    amateur: amateur_count
                }
            }
            return response;
        } catch (e) {
            console.log("Error in getPlayerList() of UserService", e);
            throw e;
        }
    }

    async getClubAcademyList(conditions, options, member_type) {
        try {
            conditions.member_type = member_type
            const totalRecords = await this.clubAcademyUtilityInst.countList(conditions);

            let baseOptions = {
                conditions: conditions,
                options: options,
                projection: { name: 1, associated_players: 1, email: 1 , user_id: 1}
            };

            let toBePopulatedOptions = {
                path: "login_details",
                projection: { status: 1, is_email_verified: 1, profile_status: 1 }
            };

            let data = await this.clubAcademyUtilityInst.populate(baseOptions, toBePopulatedOptions);

            data = new UserListResponseMapper().map(data, member_type);
            let response = {
                total: totalRecords,
                records: data
            }
            return response;
        } catch (e) {
            console.log("Error in getPlayerList() of UserService", e);
            throw e;
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

    async activate(user_id) {
        try {
            let loginDetails = await this.loginUtilityInst.findOne({ user_id: user_id })
            if (loginDetails) {
                if (!loginDetails.is_email_verified) {
                    return Promise.reject(new errors.Unauthorized("email is not verified"));
                }
                if (loginDetails.status === 'active') {
                    return Promise.reject(new errors.Conflict("status is already active"));
                }
                await this.loginUtilityInst.findOneAndUpdate({ user_id: user_id }, { status: 'active' })
                return Promise.resolve()
            }
            throw new errors.NotFound("User not found");
        } catch (e) {
            console.log("Error in activate() of UserService", e);
            return Promise.reject(e);
        }
    }

    async deactivate(user_id) {
        try {
            let loginDetails = await this.loginUtilityInst.findOne({ user_id: user_id })
            if (loginDetails) {
                if (!loginDetails.is_email_verified) {
                    return Promise.reject(new errors.Unauthorized("email is not verified"));
                }
                if (loginDetails.status === 'blocked') {
                    return Promise.reject(new errors.Conflict("status is already blocked"));
                }
                await this.loginUtilityInst.findOneAndUpdate({ user_id: user_id }, { status: 'blocked' })
                return Promise.resolve()
            }
            throw new errors.NotFound("User not found");
        } catch (e) {
            console.log("Error in deactivate() of UserService", e);
            return Promise.reject(e);
        }
    }

    async delete(user_id) {
        try {
            let loginDetails = await this.loginUtilityInst.findOne({ user_id: user_id })
            if (loginDetails) {
                let date = Date.now()
                await this.loginUtilityInst.findOneAndUpdate({ user_id: user_id }, { is_deleted: true, deleted_at: date })
                if (loginDetails.member_type === 'player') {
                    await this.playerUtilityInst.findOneAndUpdate({ user_id: user_id }, { deleted_at: date })
                }
                else {
                    await this.clubAcademyUtilityInst.findOneAndUpdate({ user_id: user_id }, { deleted_at: date })
                }
                return Promise.resolve()
            }
            throw new errors.NotFound("User not found");
        } catch (e) {
            console.log("Error in delete() of UserService", e);
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

    _prepareFilterCondition(filterConditions = {}, member_type) {
        let condition = {};
        let filterArr = []
        if (filterConditions) {
            if (filterConditions.email) {
                filterArr.push({ email: new RegExp(filterConditions.email, 'i') })
            }

            if (filterConditions.from && filterConditions.to) {
                filterArr.push({
                    createdAt: {
                        $gte: filterConditions.from,
                        $lte: filterConditions.to
                    }
                })
            }
            if (member_type === "player") {
                if (filterConditions.name) {
                    filterArr.push({
                        $or: [
                            { first_name: new RegExp(filterConditions.name, 'i') },
                            { last_name: new RegExp(filterConditions.name, 'i') }
                        ]
                    });
                }
                if (filterConditions.position) {
                    filterArr.push({
                        position: {
                            $elemMatch: {
                                name: new RegExp(filterConditions.position, 'i'),
                                priority: 1
                            }
                        }
                    })
                }
                if (filterConditions.type) {
                    filterArr.push({ player_type: new RegExp(filterConditions.type, 'i') })
                }
            } else {
                if (filterConditions.name) {
                    filterArr.push({
                        name: new RegExp(filterConditions.name, 'i')
                    });
                }
            }
            condition = {
                $and: filterArr
            }
        }
        return filterArr.length ? condition : null
    }



    _prepareSearchCondition(filters = {}, member_type) {
        let condition = {};
        let filterArr = []
        if (filters.search) {
            if (member_type == 'player') {
                filterArr.push({ first_name: new RegExp(filters.search, 'i') })
                filterArr.push({ last_name: new RegExp(filters.search, 'i') })
                filterArr.push({ player_type: new RegExp(filters.search, 'i') })
                filterArr.push({
                    position: {
                        $elemMatch: {
                            name: new RegExp(filters.search, "i"),
                            priority: 1
                        }
                    }
                })
            }
            else {
                filterArr.push({ name: new RegExp(filters.search, 'i') })
                let num = Number(filters.search)
                if (!isNaN(num)) {
                    filterArr.push({ associated_players: num })
                }
            }
            filterArr.push({
                email: new RegExp(filters.search, "i")
            })
            condition = {
                $or: filterArr
            };
        }
        return condition;
    }

}

module.exports = UserService;