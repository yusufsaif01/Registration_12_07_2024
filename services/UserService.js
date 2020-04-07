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

            let conditions = this._prepareCondition(requestedData.filter);
             
            let paginationOptions = requestedData.paginationOptions || {};
            let sortOptions = requestedData.sortOptions || {};

            let skipCount = (paginationOptions.page_no - 1) * paginationOptions.limit;
            let options = { limit: paginationOptions.limit, skip: skipCount, sort: {} };

            if (!_.isEmpty(sortOptions.sort_by) && !_.isEmpty(sortOptions.sort_order))
                options.sort[sortOptions.sort_by] = sortOptions.sort_order;

            if (member_type === 'player') {
                filterConditions = this._filterCondition(requestedData.filterConditions)
                if(filterConditions)
                {
                    conditions.$and=filterConditions.$and
                }
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
            amateur_count = await this.playerUtilityInst.countList({ player_type: 'amateur' })
            professional_count = await this.playerUtilityInst.countList({ player_type: 'professional' })
            grassroot_count = await this.playerUtilityInst.countList({ player_type: 'grassroot' })

            let baseOptions = {
                conditions: conditions,
                options: options,
                projection: { first_name: 1, last_name: 1, player_type: 1, email: 1, position: 1 }
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
                projection: { name: 1, associated_players: 1, email: 1 }
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
    _filterCondition(filterConditions = {}) {
        let condition = {};
        let filterArr = []
        if (filterConditions) {

            if (filterConditions.email) {
                filterArr.push({ email: new RegExp(filterConditions.email, 'i') })
            }
            if (filterConditions.name) {

                filterArr.push({
                    $or: [
                        { first_name: new RegExp(filterConditions.name, 'i') },
                        { last_name: new RegExp(filterConditions.name, 'i') }
                    ]
                })

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
            if (filterConditions.from && filterConditions.to) {
                filterArr.push({
                    createdAt: {
                        $gte: filterConditions.from,
                        $lte: filterConditions.to
                    }
                })
            }
            condition = {
                $and: filterArr
            }
        }
        return filterArr.length ? condition : null
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