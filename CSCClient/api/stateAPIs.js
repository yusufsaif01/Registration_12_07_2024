const APIService = require("./APIService");

class StateAPI {
    constructor(host = null) {
        this.apiService = new APIService();
        this.baseRoute = "/api/state";
    }

    async getAllStates() {
        let stateList = [];
        try {
            let url = `${this.baseRoute}/all`;
            stateList = await this.apiService.executeAPI(url, "GET");
            return stateList;
        } catch (e) {
            console.log("error in getAllStates", e);
        }
        return stateList;
    }

    async getStateById(id) {
        let state = {};
        try {
            let url = `${this.baseRoute}/byId/${id}`;
            state = await this.apiService.executeAPI(url, "GET");
            return state;
        } catch (e) {
            console.log("error in getStateById", e);
        }
        return state;
    }

    async getStatesByCountryId(countryId) {
        let state = [];
        try {
            let url = `${this.baseRoute}/byCountryId/${countryId}`;
            state = await this.apiService.executeAPI(url, "GET");
            return state;
        } catch (e) {
            console.log("error in getStatesByCountryId", e);
        }
        return state;
    }
}

module.exports = StateAPI;