const config = require("../config");
const StorageProvider = require('../storage-provider');
let countryList = [];
let stateList = [];
let cityList = [];

module.exports = {

    getDataFromS3: async function () {
        try {
            const storageProviderInst = new StorageProvider(config.storage)
            let countryData = await storageProviderInst.getDocument('country.json')
            countryList = JSON.parse(countryData.Body.toString());
            let stateData = await storageProviderInst.getDocument('state.json')
            stateList = JSON.parse(stateData.Body.toString());
            let cityData = await storageProviderInst.getDocument('city.json')
            cityList = JSON.parse(cityData.Body.toString());
            return Promise.resolve();
        }
        catch (e) {
            console.log("Error in getDataFromS3() of Master Data", e);
            return Promise.reject(e)
        }
    },

    getAllCountries: function () {
        return countryList;
    },
    getCountryById: function (id) {
        return _findById(countryList, id);
    },
    getCountryByCountryCode: function (code) {
        return _findByCode(countryList, code);
    },


    getAllStates: function () {
        return stateList;
    },

    getStateById: function (id) {
        return _findById(stateList, id);
    },

    getStatesByCountryId: function (countryId) {
        var states = stateList.filter(function (value, index) {
            return value.country_id === countryId
        })
        return states.sort(compare)
    },


    getAllCities: function () {
        return cityList;
    },
    getCityById: function (id) {
        return _findById(cityList, id);
    },
    getCitiesByStateId: function (stateId) {
        var cities = cityList.filter(function (value, index) {
            return value.state_id === stateId
        })
        return cities.sort(compare)
    }
}

let _findById = (source, id) => {
    if (id && source != null) {
        let idx = source.findIndex((c) => c.id === id);
        return (idx !== -1) ? source[idx] : {};
    }
    else return {};
}

let _findByCode = (source, code) => {
    if (code && source != null) {
        let codex = source.findIndex((c) => c.sortname === code);
        return (codex !== -1) ? source[codex] : {};
    }
    else return {};
}

function compare(a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}