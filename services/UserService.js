const Promise = require("bluebird");
const errors = require("../errors");
const UserUtility = require('../db/utilities/UserUtility');
const AuthUtility = require('../db/utilities/AuthUtility');
const BaseService = require("./BaseService");
const _ = require("lodash");
const UserListResponseMapper = require("../dataModels/responseMapper/UserListResponseMapper");

class UserService extends BaseService {

    constructor() {
        super();
        this.utilityInst = new UserUtility();
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

    async getDetails(requestedData = {}) {
        try {
            let data = await this.utilityInst.findOne({ "id": requestedData.id });

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
            return this.utilityInst.findOneAndUpdate({ "id": requestedData.id }, requestedData.updateValues);
        } catch (e) {
            console.log("Error in update() of UserUtility", e);
            return Promise.reject(e);
        }
    }

    /**
     *
     *
     * @param {*} 
     * @returns
     * @memberof UserRegistrationService
     */
    create({

        name,
        first_name,
        last_name,
        registration_number,
        member_type,
        role,
        email,
        username,
        state,
        country,
        phone
    }) {
        email = email.toLowerCase();
        let member = {};
        member.username = username;
        member.member_type = member_type;
        member.role = role;
        member.email = email;
        member.country = country;
        member.phone = phone;
        member.state = state;
        if (member_type == 'player') {
            member.first_name = first_name;
            member.last_name = last_name;
        }
        else {
            member.name = name;
            member.registration_number = registration_number;
        }


        let user = [];



        if (email) {
            user.push({ 'email': email });
        }
        if (username) {
            user.push({ 'username': username });
        }


        return this.utilityInst.findOne({ $or: user })
            .then(async (user) => {
                if (user) {
                    return Promise.reject(new errors.Conflict("User already exist."));
                }
                

                // member.password = await this.authUtilityInst.bcryptToken(password);
                return this._create(member)

            })
    }

    /**
     *
     *
     * @param {*} member
     * @returns
     * @memberof UserRegistrationService
     */
    _create(member) {

        return this.utilityInst.insert(member)
            .catch((err) => {
                // .catch(errors.Conflict, (err) => {
                console.log(err)
                if (err.constructor.name === 'Conflict') {
                    err.message = 'User already exist.';
                }

                return Promise.reject(err);
            });
    }

    bulkInsert(users) {
        return this.utilityInst.insertMany(users)
            .catch((err) => {
                // .catch(errors.Conflict, (err) => {
                console.log(err);
                if (err.constructor.name === 'Conflict') {
                    err.message = 'User already exist.';
                }

                return Promise.reject(err);
            });
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