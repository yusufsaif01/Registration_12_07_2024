const Promise = require("bluebird");
const errors = require("../errors");
const PlayerUtility = require('../db/utilities/PlayerUtility');
const ClubAcademyUtility = require('../db/utilities/ClubAcademyUtiltiy');
const AuthUtility = require('../db/utilities/AuthUtility');
const BaseService = require("./BaseService");
const _ = require("lodash");
const UserListResponseMapper = require("../dataModels/responseMapper/UserListResponseMapper");

class UserService extends BaseService {

    constructor() {
        super();
        this.playerUtilityInst = new PlayerUtility();
        this.clubAcademyUtilityInst = new ClubAcademyUtility();
        this.authUtilityInst = new AuthUtility();
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

            let totalRecords = await this.utilityInst.countList(conditions);
            let data = await this._search(conditions, null, options);
            data = new UserListResponseMapper().map(data);
            return {
                count: totalRecords,
                records: data
            };
        } catch (e) {
            console.log("Error in getList() of UserUtility", e);
            return Promise.reject(e);
        }
    }

    _search(filter, fields, options = {}) {
        return this.utilityInst.find(filter, fields, options);
    }

    async getDetails(member_type,requestedData = {}) {
        try {
            let data;
            if(member_type=='player'){
             data = await this.playerUtilityInst.findOne({ "id": requestedData.id });
            }
            else
            {
             data = await this.clubAcademyUtilityInst.findOne({ "id": requestedData.id });
            }
            if (!_.isEmpty(data)) {
                return data;
            } else {
                return Promise.reject(new errors.NotFound());
            }
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
            member.type= member_type;
            let address={};
            address.country=country;
            member.address=address;
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
                        name: new RegExp(filters.search, "i")
                    },
                    {
                        user_id: new RegExp(filters.search, "i")
                    },
                    {
                        role: new RegExp(filters.search, "i")
                    },
                    {
                        department: new RegExp(filters.search, "i")
                    }
                ]
            };
        }

        return condition;
    }

}

module.exports = UserService;