const APIService = require("./APIService");

class CityAPI {
    constructor(host = null) {
        this.apiService = new APIService();
        this.baseRoute = "/api/city";
    }

    async getAllCities() {
        let cityList = [];
        try {
            let url = `${this.baseRoute}/all`;
            cityList = await this.apiService.executeAPI(url, "GET");
            return cityList;
        } catch (e) {
            console.log("error in getAllCities", e);
        }
        return cityList;
    }

    async getCityById(id) {
        let city = {};
        try {
            let url = `${this.baseRoute}/byId/${id}`;
            city = await this.apiService.executeAPI(url, "GET");
            return city;
        } catch (e) {
            console.log("error in getCityById", e);
        }
        return city;
    }

    async getCitiesByStateId(stateId) {
        let city = [];
        try {
            let url = `${this.baseRoute}/byStateId/${stateId}`;
            city = await this.apiService.executeAPI(url, "GET");
            return city;
        } catch (e) {
            console.log("error in getCitiesByStateId", e);
        }
        return city;
    }
}

module.exports = CityAPI;