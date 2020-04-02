const APIService = require("./APIService");

class CountryAPI {
    constructor(host = null) {
        this.apiService = new APIService();
        this.baseRoute = "/api/country";
    }

    async getAllCountries() {
        let countryList = [];
        try {
            let url = `${this.baseRoute}/all`;
            countryList = await this.apiService.executeAPI(url, "GET");
            return countryList;
        } catch (e) {
            console.log("error in getAllCountries", e);
        }
        return countryList;
    }

    async getCountryById(id) {
        let country = {};
        try {
            let url = `${this.baseRoute}/byId/${id}`;
            country = await this.apiService.executeAPI(url, "GET");
            return country;
        } catch (e) {
            console.log("error in getCountryById", e);
        }
        return country;
    }

    async getCountriesByCountryCode(countryCode) {
        let country = [];
        try {
            let url = `${this.baseRoute}/byCode/${countryCode}`;
            country = await this.apiService.executeAPI(url, "GET");
            return country;
        } catch (e) {
            console.log("error in getCountriesByStateId", e);
        }
        return country;
    }
}

module.exports = CountryAPI;