const Promise = require("bluebird");
const errors = require("../errors");
const UserUtility = require('../db/utilities/UserUtility');
const UserService = require("./UserService");
const uuidv4 = require('uuid/v4');

/**
 *
 *
 * @class UserRegistrationService
 * @extends {UserService}
 */
class UserRegistrationService extends UserService {

    /**
     *Creates an instance of UserRegistrationService.
     * @memberof UserRegistrationService
     */
    constructor() {
        super();
        this.utilityInst = new UserUtility();
    }

    /**
     *
     *
     * @param {*} registerUser
     * @returns
     * @memberof UserRegistrationService
     */
    validateMemberRegistration(registerUser) {
        
        if (!registerUser.user_id) {
            return Promise.reject(new errors.ValidationFailed(
                "user_id is required", { field_name: "user_id" }
            ));
        }
        if (!registerUser.name) {
            return Promise.reject(new errors.ValidationFailed(
                "name is required", { field_name: "name" }
            ));
        }
      
        if (!registerUser.dob) {
            return Promise.reject(new errors.ValidationFailed(
                "dob is required", { field_name: "dob" }
            ));
        }
        // if (!registerUser.role) {
        //     return Promise.reject(new errors.ValidationFailed(
        //         "role is required", { field_name: "role" }
        //     ));
        // }
        if (!registerUser.password) {
            return Promise.reject(new errors.ValidationFailed(
                "password is required", { field_name: "password" }
            ));
        }
        if (!registerUser.username) {
            return Promise.reject(new errors.ValidationFailed(
                "username is required", { field_name: "username" }
            ));
        }
        
        return Promise.resolve(registerUser);
    }

    dateToPassword(dob) {
        let date = {}
        date.dateInst = new Date(dob);
        let options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        date.arr = date.dateInst.toLocaleString('en-us', options).split('/');
        date.month = date.arr[0];
        date.dd = date.arr[1];
        date.year = date.arr[2];
        return `${date.dd}${date.month}${date.year}`;
    }

    /**
     *
     *
     * @param {*} { user_id, name, email, mobile_no }
     * @returns
     * @memberof UserRegistrationService
     */
    memberRegistration(userData) {
        // let password = this.dateToPassword(userData.dob);

        let user = {
            username: userData.username,
            user_id: userData.user_id ,
            name: userData.name,
            dob: userData.dob,
            email: userData.email,
            state: userData.state,
            country: userData.country,
            phone: userData.phone,
            // role: userData.role,
            password:userData.password,
            avatar_url: 'user-avatar.jpg' // default avatar url
        };
        return this.validateMemberRegistration(user)
        .then(() => {
            return this.create(user)
            .then(this.toAPIResponse);
        })
    }

    async importEmployees({body, rows}) {
        let ColumnOrder = ["email", "name", "warehouse", "location", "department", "dob", "role", "vendor_id", "user_id", "doj", "state", "country", "phone"];

        let invalidRows  = [];
        let users = [];
        for (let x = 1; x < rows.length; x++) {
            const row = rows[x];
            if (row.length !== ColumnOrder.length) {
                invalidRows.push({
                    error: "Fields are missing.",
                    line_no: x
                });
                continue;
            }
            let user = {};
            for (let i = 0; i < ColumnOrder.length; i++) {
                user[ColumnOrder[i]] =  row[i] || null;
            }

            user.email =  user.email && user.email.toLowerCase();
            user.username =  user.user_id && user.user_id.toLowerCase();
            user.password = this.dateToPassword(user.dob);

            try {
                await this.validateMemberRegistration(user);
            } catch(err) {
                invalidRows.push({
                    error: err.message,
                    line_no: x,
                });
            }

            users.push(user);
        }

        if (invalidRows.length) {
            return Promise.reject(new errors.BadRequest("File data is invalid.", {invalidRows}));
        }
        let data = await this.bulkInsert(users);
        return data.map(this.toAPIResponse);

    }


    
    /**
     *
     *
     * @param {*} registerUser
     * @returns
     * @memberof UserRegistrationService
     */
    validateAdminRegistration(adminData) {

        if (!adminData.email) {
            return Promise.reject(new errors.ValidationFailed(
                "email is required", { field_name: "email" }
            ));
        }

        if (!adminData.password) {
            return Promise.reject(new errors.ValidationFailed(
                "password is required", { field_name: "password" }
            ));
        }

        if (!adminData.user_id) {
            return Promise.reject(new errors.ValidationFailed(
                "user id is required", { field_name: "user_id" }
            ));
        }

        if (!adminData.dob) {
            return Promise.reject(new errors.ValidationFailed(
                "dob is required", { field_name: "dob" }
            ));
        }

        // if (!adminData.doj) {
        //     return Promise.reject(new errors.ValidationFailed(
        //         "doj is required", { field_name: "doj" }
        //     ));
        // }

        return Promise.resolve(adminData);
    }

    /**
     *
     *
     * @param {*} data
     * @returns
     * @memberof UserRegistrationService
     */
    adminRegistration(data) {

        data.user_id = data.user_id || uuidv4();
        data.dob = new Date().toLocaleDateString();
        data.doj = new Date().toLocaleDateString();

        return this.validateAdminRegistration(data)
        .then(() => {
            return this.create(data)
            .then((user)=>{
                return user
            }).catch(err=>{
                console.log(err);
            });
        })
    }

    /**
     *
     *
     * @param {*} userData
     * @returns
     * @memberof UserRegistrationService
     */
    warehouseAdminRegistration(userData) {
        let date = {}
        date.dateInst = new Date(userData.dob);
        let options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        date.arr = date.dateInst.toLocaleString('en-us', options).split('/');
        date.month = date.arr[0];
        date.dd = date.arr[1];
        date.year = date.arr[2];

        let password = `${date.dd}${date.month}${date.year}`;
        let user = {
            username: userData.email,
            user_id: userData.user_id || uuidv4(),
            name: userData.name || 'Default Warehouse',
            warehouse: userData.warehouse,
            location: userData.location,
            department: userData.department || "default",
            dob: userData.dob,
            doj: userData.doj,
            email: userData.email,
            vendor_id: userData.vendor_id,
            state: userData.state,
            country: userData.country,
            phone: userData.phone,
            role: userData.role,
            password,
            avatar_url: 'user-avatar.jpg' // default avatar url
        };
        return this.validateMemberRegistration(user)
        .then(() => {
            return this.create(user)
            .then(this.toAPIResponse);
        })
    }

    /**
     *
     *
     * @param {*}
     * { user_id, name, warehouse, location, department, date, doj, role, email, username, vendor_id, avatar_url, state, country, phone, status }
     * @returns
     * @memberof UserRegistrationService
     */
    toAPIResponse({
        user_id,
        name,
        dob,
        role,
        email,
        username,
        avatar_url,
        state,
        country,
        phone,
        status
    }) {
        return {
            user_id,
            name,
            dob,
            role,
            email,
            username,
            avatar_url,
            state,
            country,
            phone,
            status
        };
    }
}

module.exports = UserRegistrationService;